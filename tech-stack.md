# Live-Connect — Tech Stack

## 1. Architecture Summary

Live-Connect uses a service-oriented architecture within a monorepo, separating concerns into: Web Client, Mobile Client, API/Backend, Real-Time Signaling, Media/SFU, Browser Extension, and supporting infrastructure (DB, cache, storage, CDN).

```
┌─────────────┐   ┌──────────────┐    ┌────────────────┐
│  Web Client │   │ Mobile Client│    │ Browser Ext.    │
│ (Next.js)   │   │ (React Native)│   │ (Sync injector) │
└──────┬──────┘   └──────┬───────┘    └───────┬─────────┘
       │                 │                     │
       └────────┬────────┴──────────┬──────────┘
                 │                   │
          ┌──────▼──────┐     ┌──────▼──────┐
          │  API Server │     │  Signaling   │
          │  (Node/Nest)│◄───►│  Server (WS) │
          └──────┬──────┘     └──────┬──────┘
                 │                   │
        ┌────────┼────────┐   ┌──────▼──────┐
        │        │        │   │ SFU (mediasoup)│
   ┌────▼──┐ ┌──▼───┐ ┌──▼──┐└─────────────┘
   │Postgres│ │Redis │ │ S3/  │
   │ (DB)  │ │(state│ │ CDN  │
   └───────┘ │/pubsub)└──────┘
             └───────┘
```

---

## 2. Frontend (Web)

| Component | Choice | Rationale |
|---|---|---|
| Framework | **Next.js (React, TypeScript)** | SSR for fast initial loads/SEO on landing pages, strong ecosystem, shared types with backend |
| Styling | **Tailwind CSS** | Rapid, consistent UI development; pairs well with component libraries |
| UI Components | **shadcn/ui** | Accessible, customizable primitives |
| State Management | **Zustand** + React Query (TanStack Query) | Lightweight global state + server-state caching |
| Video Player | **video.js** or custom HTML5 `<video>` wrapper + **YouTube IFrame API** for embeds | Unified control layer for sync engine across source types |
| Real-Time Client | **Socket.IO client** (signaling) + **mediasoup-client** (WebRTC SFU) | Reliable fallback transport + scalable media |
| Animations | **Framer Motion** | Polished UX (reactions, transitions) |

---

## 3. Mobile App

| Component | Choice | Rationale |
|---|---|---|
| Framework | **React Native (TypeScript) + Expo** | Single codebase for iOS/Android, shares logic/types with web via monorepo packages |
| Navigation | **React Navigation** | Standard, well-supported |
| Video Playback | **react-native-video** + **react-native-youtube-iframe** | Native performance for video + YouTube embeds |
| WebRTC | **mediasoup-client + react-native-webrtc** | Compatible with same SFU backend as web |
| State | **Zustand** + React Query | Shared logic with web client |
| Push Notifications | **Expo Notifications / Firebase Cloud Messaging (FCM) + APNs** | Cross-platform push |

---

## 4. Backend / API

| Component | Choice | Rationale |
|---|---|---|
| Framework | **Node.js + NestJS (TypeScript)** | Structured, modular, great for organizing API + WebSocket gateways; shares types with frontend |
| API Style | **REST (primary) + GraphQL (optional later)** | REST for simplicity at MVP stage |
| Auth | **JWT (access + refresh tokens)** + **OAuth via Passport.js** (Google, Discord, Apple) | Standard, flexible |
| Validation | **Zod / class-validator** | Type-safe input validation |
| Background Jobs | **BullMQ (Redis-backed queues)** | Video transcoding jobs, cleanup tasks, notifications |

---

## 5. Real-Time & Media Infrastructure

| Component | Choice | Rationale |
|---|---|---|
| Signaling | **Socket.IO (Node)** on dedicated signaling service | Handles room presence, playback sync events, chat, reactions |
| WebRTC SFU | **mediasoup** (self-hosted) | Open-source, scalable SFU for group video/audio beyond mesh limits (better than peer-mesh used by some competitors) |
| Sync Engine | Custom service using **Redis Pub/Sub** for room state broadcast | Low-latency playback state sync (play/pause/seek/timestamp) across instances |
| TURN/STUN | **coturn** (self-hosted) or **Twilio STUN/TURN** (managed) | NAT traversal for WebRTC |

---

## 6. Browser Extension

| Component | Choice | Rationale |
|---|---|---|
| Framework | **Plasmo** (extension framework, React+TS) | Modern DX for cross-browser (Chrome/Edge/Firefox) extension builds |
| Sync Mechanism | Content script reads/controls native `<video>` element on streaming sites (Netflix, Prime Video, Disney+); communicates with Live-Connect signaling via WebSocket | Mirrors Teleparty/TwoSeven approach — syncs playback state only, no content interception |

---

## 7. Data Layer

| Component | Choice | Rationale |
|---|---|---|
| Primary DB | **PostgreSQL** | Relational data: users, rooms, friendships, history — strong consistency |
| ORM | **Prisma** | Type-safe queries, shared schema across services |
| Cache / Real-Time State | **Redis** | Room state, pub/sub for sync events, session cache, BullMQ queues |
| Object Storage | **AWS S3** (or S3-compatible: Cloudflare R2) | Uploaded videos, avatars, thumbnails |
| Video Transcoding | **FFmpeg** (via background workers) for adaptive bitrate (HLS/DASH) | Smooth playback across varying connection speeds |
| CDN | **Cloudflare CDN** | Serve transcoded video, static assets globally |

---

## 8. Infrastructure & DevOps

| Component | Choice | Rationale |
|---|---|---|
| Hosting (MVP) | **Render** or **Railway** for API/signaling; **Vercel** for Next.js web client | Managed, low-ops, fast iteration for MVP |
| Hosting (Scale) | **AWS (ECS/EKS)** or **Hetzner + Kubernetes** | Migrate self-hosted SFU/media servers here when scaling — mediasoup benefits from dedicated VMs with good network throughput |
| Containerization | **Docker** for all backend services from day one | Eases migration from PaaS to self-managed infra later |
| CI/CD | **GitHub Actions** | Automated tests, builds, deploys |
| Monitoring | **Grafana + Prometheus** (self-hosted) or **Better Stack** (managed) | Track server health, sync drift metrics, room counts |
| Error Tracking | **Sentry** | Frontend + backend error monitoring |
| Logging | **Pino (Node logger)** + **Loki/Grafana** or **Logtail** | Centralized structured logs |

---

## 9. Monorepo Structure

| Tool | Choice | Rationale |
|---|---|---|
| Monorepo Manager | **Turborepo** | Manages web, mobile, backend, extension, and shared packages in one repo with caching/build orchestration |
| Shared Packages | `packages/types`, `packages/ui` (where applicable), `packages/sync-protocol` | Shared TypeScript types for sync events, API contracts |

```
live-connect/
├── apps/
│   ├── web/          (Next.js)
│   ├── mobile/        (React Native/Expo)
│   ├── api/          (NestJS REST API)
│   ├── signaling/      (Socket.IO + mediasoup SFU)
│   └── extension/      (Plasmo browser extension)
├── packages/
│   ├── types/         (shared TS types/interfaces)
│   ├── sync-protocol/  (sync event schemas/constants)
│   └── config/        (shared eslint/tsconfig)
└── turbo.json
```

---

## 10. Summary Table — Quick Reference

| Layer | Technology |
|---|---|
| Web Frontend | Next.js, TypeScript, Tailwind, shadcn/ui, Zustand |
| Mobile | React Native + Expo, TypeScript |
| Backend API | NestJS (Node.js, TypeScript), Prisma |
| Real-Time Signaling | Socket.IO |
| WebRTC Media | mediasoup (SFU) |
| Database | PostgreSQL |
| Cache/Pub-Sub | Redis |
| Storage | AWS S3 / Cloudflare R2 |
| CDN | Cloudflare |
| Transcoding | FFmpeg |
| Extension | Plasmo (Chrome/Edge/Firefox) |
| Hosting (MVP) | Vercel + Render/Railway |
| Hosting (Scale) | AWS or Hetzner + Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Sentry, Grafana/Prometheus |
