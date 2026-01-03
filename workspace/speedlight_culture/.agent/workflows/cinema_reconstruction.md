---
description: Reconstruction Plan for Cinema Social
---

# Reconstruction Plan: Cinema Social & Video Playback System

## Overview
This document outlines the architectural refactor of the Cinema Social feed (`app/cinema/page.tsx`). The goal is to eliminate "patchy" playback logic, resolve the Cloudflare vs. Native video conflicts, and restore a robust, high-performance user experience.

## 1. Core Philosophy
-   **Native-First Controller:** The playback logic will control the DOM element directly where possible, suppressing React state latency.
-   **Unified Player Interface:** A single `VideoPlayer` component will handle the decision tree for (Cloudflare vs YouTube vs Native), rather than 3 separate "Hero" components with different lifecycles.
-   **Modular Architecture:** The monolithic `page.tsx` will be broken down into specialized components to isolate concerns.

## 2. Component Structure

### A. `app/cinema/page.tsx` (The Container)
-   **Responsibility:** Data fetching, Global State (View Mode: 'social' | 'cinema'), and Layout wiring.
-   **Key Features Preserved:**
    -   `getCinemaFeed` data loading.
    -   `useUi` context integration (hiding navbars).
    -   `useGamepad` integration.
    -   Category distribution logic.

### B. `app/cinema/components/CinemaFeed.tsx`
-   **Responsibility:** The vertical "TikTok-style" scroll container.
-   **Key Features:**
    -   Virtualization (if needed) or Snap Scrolling.
    -   Managing the `activePost` state.
    -   **Strict Visibility Logic:** Only *one* video is "active" at a time. The rest are paused/unmounted.

### C. `app/cinema/components/VideoPlayer.tsx` (THE CRITICAL FIX)
-   **Responsibility:** A unified wrapper that takes a `post` and decides *how* to play it.
-   **Logic:**
    -   **Input:** `videoUrl`.
    -   **Decision Tree:**
        1.  Is it Cloudflare? -> Render `<iframe>` with Stream SDK.
        2.  Is it YouTube? -> Render `<iframe>` with YT API.
        3.  Is it NativeURL? -> Render `<video>` tag.
    -   **Unified Controller Hook (`usePlayback`):**
        -   Exposes simple methods: `play()`, `pause()`, `toggleMute()`.
        -   Internally handles the complexity of "Native vs SDK".
        -   **Auto-Recovery:** Includes the event-driven recovery logic (pause detection) *inside* this hook, normalizing it for all sources.

### D. `app/cinema/components/SocialOverlay.tsx`
-   **Responsibility:** The UI layer (Avatar, Like, Comment buttons, Description).
-   **Key Features:**
    -   Must be absolute positioned *over* the player.
    -   Must handle "User Paus" vs "Click to UI" distinction.

## 3. Playback Logic (The "Solution")

We will discard the "Engine A/B/C" component split in favor of a **Unified Hook** approach.

```typescript
// Conceptual Hook
function useUnifiedPlayback(ref, type) {
    const play = async () => {
        if (type === 'native') {
           // Direct DOM manipulation
           await ref.current.play();
        } else if (type === 'cloudflare') {
           // SDK Message
           ref.current.postMessage('play'); 
        }
    }
    // ... Error handling & Recovery built-in
}
```

## 4. Addressing "All Videos on Cloudflare"
The user wants all videos on Cloudflare. We cannot magically move files.
**Strategy:**
1.  **Hybrid Support (Permanent):** The code *must* always support native URLs because legacy data exists. We cannot break old videos.
2.  **Priority Check:** The `VideoPlayer` will strictly check for Cloudflare ID *first*. If found, it uses the Cloudflare engine. If not, it falls back to Native.
3.  **Future-Proofing:** This ensures that if the user manually migrates a video (updates the URL in DB), the player automatically upgrades it to the Cloudflare engine without code changes.

## 5. Execution Steps
1.  **Extract Components:** Move `SocialInterface`, `EditMetadataModal`, etc. to separate files to clean the workspace.
2.  **Build `VideoPlayer`:** Implement the robust unified player.
3.  **Reassemble `page.tsx`:** Import the new clean components.
4.  **Verify:** Test strict "de una" loading (Direct Play) on the new architecture.
