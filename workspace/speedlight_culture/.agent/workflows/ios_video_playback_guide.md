---
description: iOS Video Playback Architecture and Troubleshooting Guide
---

# iOS Safari Video Playback - Architecture Guide

This document explains the video playback architecture implemented in the Cinema Social feed to handle iOS Safari's strict autoplay restrictions, particularly in **Low Power Mode**.

## The Problem

iOS Safari has aggressive autoplay restrictions:
1. **Standard Mode**: Muted videos can autoplay, but unmuted videos require user interaction.
2. **Low Power Mode**: Even muted videos may be blocked from autoplaying to save battery.
3. **AbortError**: Multiple `.play()` calls create race conditions, causing the browser to abort playback.

### Symptoms
- Black screen instead of video content
- `NotAllowedError` in console
- `AbortError` in console
- Video frozen on first frame

## The Solution Architecture

### Core Principle: "Poster-First" Strategy

The key insight is: **never show a black screen**. Always have the poster/thumbnail visible until we're 100% certain the video is actually playing.

### State Machine

```
[INITIAL] -> [ATTEMPTING PLAY] -> [PLAYING] or [BLOCKED]
     |                                 |           |
     v                                 v           v
  Poster Visible              Poster Hidden   Poster + Play Button
```

### Critical States in `VideoPlayer.tsx`

| State | Description | Poster Visibility |
|-------|-------------|-------------------|
| `hasActuallyPlayed: false` | Video not confirmed playing | ✅ Visible |
| `hasActuallyPlayed: true` | Video `currentTime > 0.1` | ❌ Hidden (fade out) |
| `isBlocked: true` | Browser blocked autoplay | ✅ Visible + Play button |
| `isAttemptingPlay: true` | `.play()` in progress | ✅ Visible |

### Key Implementation Details

#### 1. Verifying Actual Playback (`timeupdate` event)
```tsx
onTimeUpdate={(e) => {
    const currentTime = e.currentTarget.currentTime;
    if (currentTime > 0.1 && !hasActuallyPlayed) {
        setHasActuallyPlayed(true);
        setIsBlocked(false);
    }
}}
```
> We don't trust `canplay` or `loadeddata` events. Only `timeupdate` with `currentTime > 0.1` confirms real playback.

#### 2. Preventing AbortError Race Conditions
```tsx
const attemptPlay = useCallback(async (videoElement) => {
    if (isAttemptingPlay) return; // Prevent concurrent calls
    setIsAttemptingPlay(true);
    try {
        await videoElement.play();
    } catch (error) {
        if (error.name === 'AbortError') {
            // Safe to ignore - another play() took over
        } else if (error.name === 'NotAllowedError') {
            setIsBlocked(true); // Show manual play button
        }
    } finally {
        setIsAttemptingPlay(false);
    }
}, [isAttemptingPlay]);
```

#### 3. Always Start Muted
```tsx
<video
    muted // ALWAYS start muted for autoplay compliance
    autoPlay
    playsInline
    webkit-playsinline="true"
    preload="auto"
/>
```
> Mute state is applied separately via `useEffect` only after user interaction.

#### 4. Reset States on Scroll Away
```tsx
useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                setHasActuallyPlayed(false); // Re-show poster on return
                setIsBlocked(false);
            }
        });
    }, { threshold: 0.6 });
}, []);
```

## Troubleshooting

### "Videos still show black screen"
1. Check if `poster` or `thumbnail_url` exists in the post data
2. Verify `shouldShowPoster` logic is correctly evaluating
3. Check console for image loading errors

### "Videos don't play even when tapping play button"
1. Check `handleManualPlay` is being called
2. Verify `isBlocked` state is resetting correctly
3. Look for errors in `managePlayback`

### "AbortError still appearing"
1. Ensure `isAttemptingPlay` guard is working
2. Check no other code is calling `.play()` directly on the element

### "Poster stays visible after video plays"
1. Verify `onTimeUpdate` is firing
2. Check if `currentTime` is actually incrementing
3. Ensure `hasActuallyPlayed` is being set to `true`

## Testing Checklist

- [ ] Test on iOS Safari (normal mode)
- [ ] Test on iOS Safari with **Low Power Mode enabled**
- [ ] Test on Android Chrome
- [ ] Test scroll-to-view and scroll-away behavior
- [ ] Test tap-to-play when blocked
- [ ] Test double-tap to mute/unmute
- [ ] Test deep links (`?video=xxx`)

## Debug Mode

To enable the mobile debug console, uncomment this line in `page.tsx`:
```tsx
{/* DEBUG: Uncomment for mobile debugging
<DebugConsole />
*/}
```

This will show all console logs directly on the mobile screen.
