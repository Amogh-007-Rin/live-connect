# Live-Connect — System Requirements Specification (SRS)

## 1. Overview

Live-Connect is a synchronized watch-party platform that lets friends watch any content together — video files, YouTube/embeddable media, streaming platforms (Netflix, Prime Video, etc.), or shared browser sessions — while communicating via real-time video/audio chat. The goal is to outperform Watch2Gether, Hyperbeam, Teleparty, Watch Party, and TwoSeven on sync quality, content flexibility, social experience, and overall UX.

### 1.1 Vision
A single platform where a host creates a "Room," shares a code or link, and any number of friends join with synced playback of nearly any content source, plus live video/audio chat, reactions, and shared controls — on web and mobile.

### 1.2 Goals
- Sub-second playback sync drift across participants
- Support for multiple content source types (uploaded video, embeddable links, streaming services via browser extension, screen share)
- Built-in WebRTC video/audio chat (small group, mesh or SFU-based)
- Polished, modern, low-friction UX (room creation in seconds)
- Cross-platform: responsive web app + native iOS/Android apps
- Account system with profiles, room history, and saved rooms/favorites
- Architecture that can scale from MVP (few concurrent rooms) to thousands of rooms

### 1.3 Non-Goals (for MVP)
- Live TV/cable integration
- Monetization/payment systems (deferred)
- Advanced moderation tooling beyond basic host controls
- Multi-language localization (deferred)

---

## 2. Stakeholders & User Roles

| Role | Description |
|---|---|
| **Host** | Creates a room, controls playback/content source, manages participants, sets room permissions |
| **Participant** | Joins via link/code, watches synced content, participates in chat/voice/video |
| **Registered User** | Has an account; can save rooms, view history, manage profile/friends |
| **Guest** | Can join a room via code/link without an account (limited features) |
| **Admin** (internal) | Platform-level moderation, analytics, system health |

---

## 3. Functional Requirements

### 3.1 Authentication & Accounts
- FR-1.1: Users can register via email/password or OAuth (Google, Discord, Apple for iOS)
- FR-1.2: Users can log in/out and reset passwords
- FR-1.3: Registered users have profiles (display name, avatar, bio)
- FR-1.4: Users can view their room history (rooms hosted/joined, watch history)
- FR-1.5: Guests can join rooms via link/code without registering, with a temporary display name
- FR-1.6: Hosting a room requires an account; joining does not (configurable per room)
- FR-1.7: Users can add friends and see friend online/room status

### 3.2 Room Management
- FR-2.1: Authenticated users can create a room, generating a unique room code and shareable link
- FR-2.2: Room creator becomes the Host; host role is transferable
- FR-2.3: Rooms support configurable settings: public/private/unlisted, max participants, password protection, content lock (only host controls playback)
- FR-2.4: Participants join via room code entry or direct link
- FR-2.5: Host can kick/ban participants, mute participants, transfer host role
- FR-2.6: Rooms persist for a configurable duration after last activity, then auto-close
- FR-2.7: Users can save/bookmark rooms for recurring sessions (e.g., weekly movie night)

### 3.3 Content Sources & Playback Sync
- FR-3.1: **Direct video upload** — host uploads a video file; server transcodes/streams it to all participants
- FR-3.2: **Embeddable links** — YouTube, Vimeo, and other oEmbed/iframe-compatible sources, synced via player API
- FR-3.3: **Screen/tab sharing** — host shares a browser tab or screen via WebRTC; stream relayed to participants (Watch2Gether-style fallback)
- FR-3.4: **Streaming service sync via browser extension** — companion extension (Chrome/Edge/Firefox) injects a sync layer into supported sites (Netflix, Prime Video, Disney+, etc.), broadcasting play/pause/seek events through Live-Connect's sync engine while each participant streams from their own legitimate account
- FR-3.5: Playback state (play/pause/seek/timestamp) is synchronized across all participants with target drift < 500ms
- FR-3.6: Automatic re-sync/recovery when a participant's connection lags or reconnects
- FR-3.7: Host (or designated co-hosts) controls playback; participants can request control (configurable)
- FR-3.8: Support for subtitle/caption upload and sync (for direct video uploads)
- FR-3.9: Queue system — add multiple videos/links to a playlist for the session

### 3.4 Real-Time Communication
- FR-4.1: WebRTC-based video and audio chat among room participants
- FR-4.2: Participants can toggle camera/mic on/off; push-to-talk option
- FR-4.3: Text chat with emoji support, @mentions, and message history (session-scoped)
- FR-4.4: Reaction system (emoji reactions overlaying the video, e.g., 👍❤️😂)
- FR-4.5: Picture-in-picture / floating video tiles for participant webcams while content plays
- FR-4.6: Screen layout options: theater mode (content focus), grid mode (faces focus), split view
- FR-4.7: Voice activity detection (visual indicator when someone is speaking)

### 3.5 Notifications
- FR-5.1: In-app notifications for friend requests, room invites, "friend started a room"
- FR-5.2: Push notifications on mobile apps for invites and room activity
- FR-5.3: Email notifications for account-related events (password reset, security alerts)

### 3.6 Mobile Application
- FR-6.1: React Native app (iOS + Android) with feature parity for: account management, room creation/joining, embeddable/queue playback, chat (text + voice/video), notifications
- FR-6.2: Mobile playback sync for embeddable sources and uploaded video; screen-share/extension-based sync is web-only initially, with mobile participants able to *view* the synced stream
- FR-6.3: Native camera/mic permissions handling for WebRTC chat

### 3.7 Admin & Platform
- FR-7.1: Admin dashboard for monitoring active rooms, server load, abuse reports
- FR-7.2: Reporting system — users can report rooms/users for abuse
- FR-7.3: Automated room cleanup for inactive/empty rooms

---

## 4. Non-Functional Requirements

### 4.1 Performance
- NFR-1.1: Playback sync drift target: < 500ms across participants under normal network conditions
- NFR-1.2: Room join time: < 2 seconds from code entry to room load
- NFR-1.3: Support at least 20 concurrent participants per room for video/audio chat (MVP), with architecture supporting scale-up via SFU
- NFR-1.4: Video transcoding for uploads completes within reasonable time relative to file size (adaptive bitrate generation)

### 4.2 Scalability
- NFR-2.1: Stateless application servers behind a load balancer; horizontal scaling for API/signaling layers
- NFR-2.2: SFU (Selective Forwarding Unit) architecture for WebRTC to support growth beyond mesh-network limits
- NFR-2.3: Room/session state stored in a fast, shared store (e.g., Redis) to allow any server instance to handle any room
- NFR-2.4: CDN-backed delivery for uploaded video content and static assets

### 4.3 Reliability & Availability
- NFR-3.1: Target uptime 99.5% for MVP, 99.9% post-scale
- NFR-3.2: Graceful reconnection handling — participants who disconnect can rejoin without disrupting the room
- NFR-3.3: Automatic failover for signaling servers

### 4.4 Security & Privacy
- NFR-4.1: All traffic encrypted via TLS/HTTPS and DTLS-SRTP for WebRTC media
- NFR-4.2: Passwords hashed with industry-standard algorithms (bcrypt/argon2)
- NFR-4.3: Room access control enforced server-side (private rooms require auth check, password rooms require validation)
- NFR-4.4: Browser extension requests minimum necessary permissions and does not capture/store streaming service credentials
- NFR-4.5: Compliance considerations for GDPR (EU users) — data export/deletion requests
- NFR-4.6: Rate limiting on auth endpoints and room creation to prevent abuse

### 4.5 Usability
- NFR-5.1: Room creation achievable in 3 clicks or fewer from landing page
- NFR-5.2: Responsive design for desktop, tablet, mobile web
- NFR-5.3: Accessibility — keyboard navigation, screen-reader support for core flows, captioning support

### 4.6 Maintainability
- NFR-6.1: Modular monorepo or service-based architecture allowing independent deployment of signaling, media, and API services
- NFR-6.2: Automated test coverage for core sync logic and API endpoints
- NFR-6.3: Centralized logging and monitoring across services

---

## 5. Constraints & Assumptions

- The browser extension model assumes each participant has their own valid subscription to streaming services (Netflix, etc.) — Live-Connect syncs *playback state*, not content itself, for licensed third-party platforms. This is the same legal model used by Teleparty/TwoSeven.
- Direct video upload/streaming must respect copyright — platform terms should prohibit uploading copyrighted content the user doesn't have rights to; basic abuse reporting covers this for MVP.
- MVP targets a small-to-mid user base; infrastructure choices favor managed services to reduce ops overhead initially, with a clear scale-up path.
- React Native chosen for mobile to maximize code/logic reuse with the web frontend team.

---

## 6. Success Metrics (MVP)

- Average sync drift across test rooms < 500ms
- Room creation-to-first-playback time < 30 seconds
- Successful video/audio chat connection rate > 95% across common browsers/devices
- User retention: % of users who host/join a second room within 7 days
