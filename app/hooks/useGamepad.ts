import { useEffect, useRef, useState, useCallback } from 'react';

type GamepadButtonHandler = () => void;

interface GamepadHandlers {
    onUp?: GamepadButtonHandler;
    onDown?: GamepadButtonHandler;
    onLeft?: GamepadButtonHandler;
    onRight?: GamepadButtonHandler;
    onSelect?: GamepadButtonHandler; // A / Cross
    onBack?: GamepadButtonHandler;   // B / Circle
}

/**
 * Hook to poll gamepad status and trigger callbacks.
 * Optimized for 60fps polling without re-renders unless connection state changes.
 */
export function useGamepad(handlers: GamepadHandlers, isEnabled: boolean = true) {
    const [isConnected, setIsConnected] = useState(false);
    const requestRef = useRef<number | null>(null);
    const lastButtonState = useRef<boolean[]>([]);

    // Handlers need to be ref-stable to avoid stale closures in the loop
    const handlersRef = useRef(handlers);
    useEffect(() => {
        handlersRef.current = handlers;
    }, [handlers]);

    const scanGamepads = useCallback(() => {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        if (!gamepads) return;

        // We focus on the first connected gamepad for now
        const gamepad = Object.values(gamepads).find(gp => gp && gp.connected);

        if (gamepad) {
            if (!isConnected) setIsConnected(true);

            // Standard Mapping (Xbox/DualShock Standard via Browser API)
            // 0: A/Cross, 1: B/Circle, 12: Up, 13: Down, 14: Left, 15: Right

            const buttons = gamepad.buttons;
            const currentHandlers = handlersRef.current;

            // Helper to check trigger (pressed now, wasn't before)
            const checkButton = (index: number, callback?: () => void) => {
                const isPressed = buttons[index]?.pressed;
                const wasPressed = lastButtonState.current[index] || false;

                if (isPressed && !wasPressed && callback) {
                    callback();
                }

                // Update state
                lastButtonState.current[index] = isPressed;
            };

            // D-PAD & STICKS (Simple Threshold for Sticks)
            // Note: Sticks usually mapped to Axes 0,1 (Left Stick)
            const AXIS_THRESHOLD = 0.5;

            // UP
            if (buttons[12]?.pressed || (gamepad.axes[1] < -AXIS_THRESHOLD)) {
                if (!lastButtonState.current[12]) { // Debounce axis like a button
                    currentHandlers.onUp?.();
                    lastButtonState.current[12] = true;
                }
            } else {
                lastButtonState.current[12] = false;
            }

            // DOWN
            if (buttons[13]?.pressed || (gamepad.axes[1] > AXIS_THRESHOLD)) {
                if (!lastButtonState.current[13]) {
                    currentHandlers.onDown?.();
                    lastButtonState.current[13] = true;
                }
            } else {
                lastButtonState.current[13] = false;
            }

            // LEFT
            if (buttons[14]?.pressed || (gamepad.axes[0] < -AXIS_THRESHOLD)) {
                if (!lastButtonState.current[14]) {
                    currentHandlers.onLeft?.();
                    lastButtonState.current[14] = true;
                }
            } else {
                lastButtonState.current[14] = false;
            }

            // RIGHT
            if (buttons[15]?.pressed || (gamepad.axes[0] > AXIS_THRESHOLD)) {
                if (!lastButtonState.current[15]) {
                    currentHandlers.onRight?.();
                    lastButtonState.current[15] = true;
                }
            } else {
                lastButtonState.current[15] = false;
            }

            // ACTIONS
            checkButton(0, currentHandlers.onSelect); // A
            checkButton(1, currentHandlers.onBack);   // B

        } else {
            if (isConnected) setIsConnected(false);
        }

        requestRef.current = requestAnimationFrame(scanGamepads);
    }, [isConnected]);

    useEffect(() => {
        if (isEnabled) {
            requestRef.current = requestAnimationFrame(scanGamepads);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isEnabled, scanGamepads]);

    // Get the ID for display purposes
    const [gamepadId, setGamepadId] = useState<string | null>(null);
    useEffect(() => {
        if (isConnected) {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = Object.values(gamepads).find(g => g && g.connected);
            if (gp) setGamepadId(gp.id);
        } else {
            setGamepadId(null);
        }
    }, [isConnected]);

    return { isConnected, gamepadId };
}

