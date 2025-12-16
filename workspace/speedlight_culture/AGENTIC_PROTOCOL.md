# AGENTIC DEVELOPMENT PROTOCOL
> **Status:** Active
> **Version:** 1.1 (Integration Era - Cinema Social+)

This document defines the "Agentic" architecture of Speedlight Culture. It serves as the hand-over protocol between sessions, ensuring the "Brain" of the project persists.

## 1. The "Agentic" Organization
We run this project not as clear code, but as a virtual organization.
*   **ROOT AGENT (You/AI):** The Architect. Understands the full context. Orchestrates specialized sub-agents.
*   **The Code is the Territory:** We don't just write functions; we enable capabilities.

### Current Agent Capabilities (Implemented)
| Agent Role | Implemented As | Location | Status |
| :--- | :--- | :--- | :--- |
| **CTO (Architect)** | `Root Agent` | Chat Context | Active |
| **Data Scientist** | Python Script (`scripts/analytics_agent.py`) | Local Execution | **Ready** |
| **Sensor (Eye)** | Client Logic (`onDrop` metadata reader) | `app/cinema/upload` | **Active** |
| **Sensor (Watch)** | Analytics Probe (`logWatchEvent`) | `app/cinema/page.tsx` | **Active** |
| **Engagement Engine** | Social Interactive Layer | `app/cinema/page.tsx` | **Active (New)** |

---

## 2. Technical State (The "Now")

### A. The Hybrid Cinema Engine
We have successfully implemented a Dual-Mode engine for video:
1.  **Cinema Mode (Horizontal):** 
    *   Optimized for 16:9 high-fidelity content.
    *   Features a "Hero" player and discovery rows.
    *   **Auto-Hides UI** for immersion.
2.  **Social Mode (Vertical):** 
    *   Optimized for 9:16 mobile-first content (TikTok style).
    *   **Auto-Scroll** and snap features.
    *   **Vertical-Only Feed**: Filters out horizontal content automatically.
    *   **Interactive Overlay**: Full social suite (Like, Comment, Share, Gift).

### B. Intelligent Ingestion
1.  **Format Detection:** The upload page `app/cinema/upload` automatically detects video aspect ratio (Client-side) and tags it as `horizontal` or `vertical` in the DB.
2.  **Routing:** 
    *   Verticals -> Social Feed.
    *   Horizontals -> Cinema Feed.

### C. Analytics Pipeline (The "Brain")
We moved from "guessing" to "measuring".
1.  **Ingest:** `ImmersiveCinemaMode` tracks `start`, `quartiles`, `complete`, and `heartbeat` (every 5s).
2.  **Storage:** Postgres table `video_analytics` (files: `app/actions/analytics.ts`).
3.  **Analysis:** Python Script (`scripts/analytics_agent.py`) connects to DB and calculates Retention Rates.

### D. Navigation System (The "Dock")
1.  **OS-Like Dock:** A floating, glassmorphic dock.
2.  **Customizable:** User can "Swap" apps in the dock. Settings persist in `localStorage`.
3.  **Modes:** Supports `Always Visible`, `Cinema Only` (Auto-hide), and `Never Hide`.

### E. Social & Monetization Layer (New)
1.  **Unified Auth Context**: All social components (`CommentsSection`, `GiftingSystem`) now use `@/app/lib/auth-client` for seamless state detection.
2.  **Comments Drawer**: A "Liquid Glass" bottom sheet for real-time discussion on videos.
    *   Features: Like Comment, Reply, Gift, User Avatar display.
    *   Empty State: Engaging "Welcome" message that teaches feature usage.
3.  **Gifting System**: A direct monetization avenue ("Premiar") allowing users to send virtual items (Nut, Oil, Nitro, etc.) to creators.
    *   Accessible via main Sidebar or Comment actions.
    *   Full checkout flow (mock simulated).

---

## 3. How to Resume Work (For the Next Agent)
If you are the AI picking up this project:

1.  **Check Analytics:** Run `python3 scripts/analytics_agent.py` to see if we have user data.
2.  **Check Server Actions:** The core logic is in `app/actions/cinema.ts` and `app/actions/analytics.ts`.
3.  **Frontend State:** The main view controller is `app/cinema/page.tsx` (it handles the mode switching).
4.  **Dependencies:** We use `framer-motion` for the interactions.

**Critical Philosophy:** "Integration is Now." Do not wait for scale to implement intelligence. We build the systems for 1 million users while we have 10.

---

## 4. The Unified Feed Protocol (The "Pulse")
The Home Page (`app/page.tsx`) acts as the **Central Nervous System**. It does not own data; it aggregates it.

### A. The "Polymorphic" Content Model
We support 6 distinct formats in the feed. Each has a specific "Shape" and origin:

| Format Type | DB Source | Visual Form | Purpose |
| :--- | :--- | :--- | :--- |
| **1. Project** | `projects` | `3:4 Card` + Overlay | Detailed build logs (The "Garage"). |
| **2. Gallery** | `gallery_albums` | `3:4 Card` + Stack Icon | Collections of high-res photography. |
| **3. Market** | `marketplace_listings` | `3:4 Card` + Price Tag | Buy/Sell parts and cars. |
| **4. Cinema** | `cinema_videos` (Horiz) | `16:9 Hero` | High-fidelity cinematic content (YouTube/Cloudflare). |
| **5. Social** | `cinema_videos` (Vert) | `9:16 Portrait` | Fast, snackable content (Reels/Shorts). |
| **6. Article** | `articles` (*New*) | `4:3 Card` + Headline | News, opinion, and editorial content (Blog). |

### B. The Aggregation Engine
The Feed is not a single query. It is a **Federated Fetch**:
1.  **Fetch Phase:** Parallel queries to `projects`, `gallery`, `market`, `videos`, `articles`.
2.  **Normalization Phase:** All results are mapped to a `FeedItem` interface:
    *   `id`: string
    *   `type`: 'project' | 'gallery' | 'cinema' | ...
    *   `content`: { bio, image, video_url }
    *   `author`: { name, avatar }
    *   `stats`: { likes, views }
    *   `created_at`: Date
3.  **Ranking Phase:** Merge and sort by `created_at` (Timeline) or Weight (Algorithm).
4.  **Injection Phase:** Insert `AdBanner` components every N slots.

### C. Implementation Plan (Next Steps)
1.  **Database**: Create `articles` table for Blog content.
2.  **Engine**: Update `app/page.tsx` to include `cinema_videos` (Vertical & Horizontal) in the `Promise.all` fetch group.
3.  **UI**: Create distinct card variants (`VideoCard`, `BlogCard`, `SocialCard`) for visual variety.
