# Live-Connect — Project Execution Plan

## Guiding Principle
Build incrementally, validating the hardest technical risk (playback sync + WebRTC) early, before investing heavily in polish, mobile, or the browser extension.

---

## Phase 0: Foundation & Setup (Week 1–2)

**Goals:** Repo, infra skeleton, core architecture decisions validated.

- Set up Turborepo monorepo (web, api, signaling, mobile, extension, shared packages)
- Configure CI/CD (GitHub Actions): lint, type-check, test pipelines
- Provision dev infrastructure: PostgreSQL + Redis (Docker locally, managed instances for staging)
- Define shared TypeScript types for: User, Room, Participant, SyncEvent, ChatMessage
- Set up Prisma schema (users, rooms, room_participants, friendships, room_history)
- Basic Sentry + logging setup

**Deliverable:** Empty but wired-up apps that build/deploy; shared schema in place.

---

## Phase 1: Auth & Room Core (Week 3–5)

**Goals:** Users can register, log in, create/join a basic room.

- Implement auth (email/password + JWT, Google OAuth)
- User profile CRUD
- Room creation (generate unique code/link, store settings: privacy, password, max participants)
- Join room flow (by code/link, guest vs. authenticated)
- Basic room UI shell (web): participant list, room settings panel
- Host/participant role logic, host transfer, kick/ban

**Deliverable:** Users can create an account, spin up a room, and others can join it (no synced media yet).

---

## Phase 2: Sync Engine — Embeddable Content (Week 6–9)

**Goals:** Core differentiator #1 — rock-solid sync for the easiest content type first.

- Build signaling service (Socket.IO) with room-based namespaces
- Implement sync protocol: play/pause/seek/timestamp events, host authority model, clock drift correction (NTP-style offset calculation between clients)
- Integrate YouTube IFrame Player API on web; sync against signaling events
- Add playlist/queue feature (add/remove/reorder items)
- Build reconnection handling (rejoin room, resync state on reconnect)
- Write automated tests simulating multiple clients to measure drift

**Deliverable:** Multiple users can watch a YouTube video together with <500ms drift, with queue support. This is the first genuinely usable MVP for internal testing.

---

## Phase 3: WebRTC Video/Audio Chat (Week 10–13)

**Goals:** Core differentiator #4 — social layer.

- Deploy mediasoup SFU (containerized, on a dedicated VM with good bandwidth)
- Integrate mediasoup-client on web; camera/mic toggle, device selection
- Build participant video tile UI (grid mode, theater mode with floating tiles)
- Implement text chat (Socket.IO) with emoji support
- Implement emoji reaction overlay system
- Voice activity detection indicator
- TURN/STUN setup (coturn or managed) for NAT traversal testing across networks

**Deliverable:** Room participants can see/hear each other while watching synced YouTube content — feature parity with Watch2Gether's social layer, with better media quality via SFU.

---

## Phase 4: Direct Video Upload & Screen Share (Week 14–17)

**Goals:** Expand content sources.

- File upload flow (chunked upload to S3/R2)
- FFmpeg transcoding pipeline (background workers via BullMQ) → HLS output for adaptive streaming
- Sync engine extended to support HLS player (custom HTML5 video wrapper)
- Subtitle upload/sync support
- Screen/tab sharing via WebRTC (host shares screen, broadcast through SFU to participants) as fallback for unsupported sites

**Deliverable:** Hosts can upload a video file or share their screen, and it syncs across the room with chat/video overlay.

---

## Phase 5: Browser Extension (Week 18–21)

**Goals:** Core differentiator #3 — the hardest competitive edge (Netflix/streaming sync).

- Build Plasmo-based extension scaffold (Chrome first, then Firefox/Edge)
- Content scripts for Netflix and one other major platform (Prime Video or Disney+) — detect native video element, hook play/pause/seek
- Extension connects to Live-Connect signaling using room code/session token
- Sync playback state bidirectionally between extension users and the room
- UI overlay within the extension showing room chat/participants (mini widget)
- Test across account-tier restrictions (e.g., simultaneous stream limits — document as known limitation, not a bug)

**Deliverable:** Users with their own Netflix subscriptions can watch in sync via the extension, with Live-Connect chat/video overlay — matching Teleparty's core feature with better social UX.

---

## Phase 6: Mobile App (Week 22–26)

**Goals:** Cross-platform reach.

- Scaffold React Native/Expo app reusing shared types/sync-protocol package
- Implement auth, room create/join, profile screens
- Integrate sync playback for YouTube/HLS sources (react-native-video, react-native-youtube-iframe)
- Integrate mediasoup-client + react-native-webrtc for video/audio chat
- Push notifications (FCM/APNs) for invites and friend activity
- Note: extension-based sync is web-only; mobile users in such rooms view a relayed stream (via screen-share/SFU) rather than controlling the native app

**Deliverable:** iOS/Android apps with feature parity for embeddable/uploaded content + chat; submitted to App Store/Play Store (beta channels).

---

## Phase 7: Polish, Hardening & Beta Launch (Week 27–30)

**Goals:** Production readiness.

- UX polish pass: animations, onboarding flow, empty states, error handling
- Load testing signaling/SFU for target concurrency (20+ participants/room)
- Security review: rate limiting, input validation audit, room access control tests
- GDPR data export/delete flows
- Monitoring dashboards (Grafana) for sync drift, room counts, server health
- Abuse reporting flow + basic admin dashboard
- Closed beta with real friend groups; collect feedback on sync quality, UX vs. competitors

**Deliverable:** Stable beta release across web + mobile, ready for wider rollout.

---

## Phase 8: Scale-Up Readiness (Post-MVP, ongoing)

- Migrate hosting from PaaS (Vercel/Render) to AWS/Hetzner+Kubernetes as load grows
- Horizontal scaling for signaling servers (Redis-backed Socket.IO adapter)
- Multiple SFU instances with load-based room assignment
- CDN optimization for transcoded video delivery
- Expand extension support to additional streaming platforms based on user demand
- Begin monetization exploration (premium rooms, higher participant limits, custom branding)

---

## Risk & Mitigation Summary

| Risk | Mitigation |
|---|---|
| Playback sync drift across varying network conditions | Build sync engine and test it first (Phase 2) before any other feature; use NTP-style clock offset correction |
| WebRTC scaling beyond mesh limits | Use mediasoup SFU from the start, not peer-mesh |
| Browser extension fragility (streaming sites change DOM frequently) | Modular content-script architecture per site; monitor and patch quickly; start with 1–2 platforms |
| Streaming service ToS concerns | Sync playback state only (no content capture/redistribution), matching Teleparty/TwoSeven's established model |
| Mobile/extension feature gap | Clearly communicate limitations in UI; prioritize most-used content types for mobile |

---

## Timeline Summary

| Phase | Duration | Focus |
|---|---|---|
| 0 | 2 weeks | Setup |
| 1 | 3 weeks | Auth & Rooms |
| 2 | 4 weeks | Sync Engine (YouTube) |
| 3 | 4 weeks | WebRTC Chat |
| 4 | 4 weeks | Upload & Screen Share |
| 5 | 4 weeks | Browser Extension |
| 6 | 5 weeks | Mobile App |
| 7 | 4 weeks | Polish & Beta |
| **Total** | **~30 weeks (~7 months)** | MVP to Beta |
