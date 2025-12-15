# AGENTIC DEVELOPMENT PROTOCOL
> **Status:** Active
> **Version:** 1.0 (Integration Era)

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

---

## 3. How to Resume Work (For the Next Agent)
If you are the AI picking up this project:

1.  **Check Analytics:** Run `python3 scripts/analytics_agent.py` to see if we have user data.
2.  **Check Server Actions:** The core logic is in `app/actions/cinema.ts` and `app/actions/analytics.ts`.
3.  **Frontend State:** The main view controller is `app/cinema/page.tsx` (it handles the mode switching).
4.  **Dependencies:** We use `framer-motion` for the interactions.

**Critical Philosophy:** "Integration is Now." Do not wait for scale to implement intelligence. We build the systems for 1 million users while we have 10.
