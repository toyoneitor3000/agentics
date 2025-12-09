# Technical Implementation Plan

## Technology Stack
*   **Framework**: Next.js (React) - Recommended for SEO, routing, and server-side capabilities needed for a platform with auth and dashboards.
*   **Language**: TypeScript / JavaScript.
*   **Styling**: Vanilla CSS (focused on high-end aesthetics, glassmorphism, animations).
*   **Authentication**: Google Auth + Native Email/Password (via NextAuth.js or Supabase Auth).
*   **Database**: Supabase (PostgreSQL) recommended for relational data (users, votes, comments) and storage (images).

## Architecture
### Frontend
*   **Landing Page**: High-impact design, explaining the academy and current competitions.
*   **Auth Pages**: Login/Register (Student/Professor).
*   **Dashboard**: Protected route displaying user stats and course timeline.
*   **Gallery/Submissions**: Interface for uploading photos for "Photo of the Week/Month/Year".

### Backend / Data Features needed
*   User table (Roles: Student, Admin/Professor).
*   **Contest System**:
    *   **Pre-Approval Queue**: Logic for Jurors to Approve/Reject submissions.
    *   **Blind Moderation**: Backend logic to serve images without author data to Jurors.
    *   Submissions table with Status (Pending, Approved, Rejected, Reason).
    *   **Hybrid Voting**: Weighted algorithm (70% Public count, 30% Jury score).
    *   **Jury Management**: Logic for user application and community voting to elect jurors.
    *   Comments system (threaded/Facebook-style).
*   **Forum System**: Categories, threads, replies, and "Verified" badges for professors.
*   Course progress tracking.
*   Media upload handling (Storage buckets).
*   CMS/Admin panel logic to select and "Publish" the winners.

### Footer Requirements
*   "Diseñado y Desarrollado por Purrpurr.dev"
*   "Speedlight Culture para potenciar la cultura automotriz"

## Roadmap
1.  **Setup**: Initialize Next.js project.
2.  **Design System**: Define CSS variables for colors, typography (Google Fonts), and base styles (Dark mode, neon/vibrant accents implied by "Speedlight").
3.  **Authentication**: Implement Sign-up/Login flows.
4.  **Dashboard UI**: Build the user interface for tracking progress.
5.  **Submission System**: Build the upload functionality for competitions.
6.  **Public Showcase**: Pages to display the "Photo of the Week" and other winners.
