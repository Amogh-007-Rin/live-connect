<div align="center">

# 🎬 Live-Connect

### Real-time synchronized watch parties — with built-in video chat

Watch YouTube, uploaded videos, screen shares, and your favorite streaming services together with friends, perfectly in sync, with live video & audio chat.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?logo=react&logoColor=white)](#)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](#)
[![WebRTC](https://img.shields.io/badge/WebRTC-mediasoup-333333?logo=webrtc&logoColor=white)](#)

</div>

---

## ✨ Overview

**Live-Connect** is an open-source, WebRTC-based watch-party platform. A host creates a **Room**, shares a link or code, and friends join from web or mobile for a perfectly synced viewing experience — complete with live webcam, voice chat, text chat, and emoji reactions.

Built to outperform existing watch-party tools (Watch2Gether, Teleparty, Hyperbeam, TwoSeven) on **sync accuracy**, **content flexibility**, and **social experience**.

### Why Live-Connect?

| | |
|---|---|
| ⚡ **Sub-second sync** | NTP-style clock correction keeps everyone within ~500ms |
| 🎥 **Built-in video/audio chat** | SFU-powered WebRTC (mediasoup) — scales beyond simple peer-mesh |
| 📺 **Multiple content sources** | YouTube, direct uploads, screen share, and streaming services via browser extension |
| 📱 **Web + Mobile** | Responsive web app and native iOS/Android apps from one codebase |
| 🧩 **Browser extension** | Sync Netflix, Prime Video & more — each viewer streams from their own account |
| 🔓 **Open source** | Self-host it, fork it, extend it |

---

## 🖼️ System Architecture

```mermaid
flowchart TB
    subgraph Clients["👥 Clients"]
        WEB["🌐 Web App<br/>(Next.js)"]
        MOBILE["📱 Mobile App<br/>(React Native / Expo)"]
        EXT["🧩 Browser Extension<br/>(Netflix, Prime Video, etc.)"]
    end

    subgraph Edge["🚪 Edge / Gateway"]
        LB["⚖️ Load Balancer / CDN<br/>(Cloudflare)"]
    end

    subgraph Backend["⚙️ Application Layer"]
        API["🔧 API Server<br/>(NestJS — Auth, Rooms, Profiles)"]
        SIGNAL["📡 Signaling Server<br/>(Socket.IO — Sync Events, Chat)"]
        SFU["🎙️ WebRTC SFU<br/>(mediasoup — Video/Audio)"]
        WORKER["🛠️ Background Workers<br/>(BullMQ — Transcoding, Cleanup)"]
    end

    subgraph Data["💾 Data Layer"]
        PG[("🗄️ PostgreSQL<br/>Users · Rooms · History")]
        REDIS[("⚡ Redis<br/>Room State · Pub/Sub · Queues")]
        S3[("📦 Object Storage (S3 / R2)<br/>Videos · Avatars")]
    end

    WEB --> LB
    MOBILE --> LB
    EXT -.->|"Sync events only"| LB

    LB --> API
    LB --> SIGNAL
    LB --> SFU

    API <--> PG
    API <--> REDIS
    SIGNAL <--> REDIS
    SFU <--> REDIS

    API --> WORKER
    WORKER --> S3
    WORKER --> REDIS

    SFU -. "Audio/Video Streams" .-> WEB
    SFU -. "Audio/Video Streams" .-> MOBILE

    S3 -->|"Transcoded HLS"| LB

    style WEB fill:#0ea5e9,color:#fff
    style MOBILE fill:#0ea5e9,color:#fff
    style EXT fill:#8b5cf6,color:#fff
    style LB fill:#f59e0b,color:#fff
    style API fill:#10b981,color:#fff
    style SIGNAL fill:#10b981,color:#fff
    style SFU fill:#10b981,color:#fff
    style WORKER fill:#10b981,color:#fff
    style PG fill:#475569,color:#fff
    style REDIS fill:#475569,color:#fff
    style S3 fill:#475569,color:#fff
```

### How a watch session works

```mermaid
sequenceDiagram
    autonumber
    participant H as 🎬 Host
    participant API as 🔧 API Server
    participant SIG as 📡 Signaling Server
    participant SFU as 🎙️ Media SFU
    participant P as 👤 Participant

    H->>API: Create Room (settings, content source)
    API-->>H: Room Code + Link

    P->>API: Join Room (code/link)
    API-->>P: Room metadata + signaling token

    H->>SIG: Connect to room namespace
    P->>SIG: Connect to room namespace

    H->>SFU: Establish media transport (cam/mic)
    P->>SFU: Establish media transport (cam/mic)
    SFU-->>P: Relay Host's audio/video
    SFU-->>H: Relay Participant's audio/video

    H->>SIG: Playback event (play/seek/pause + timestamp)
    SIG->>P: Broadcast sync event
    P->>P: Adjust local playback (clock-corrected)
```

---

## 🧱 Tech Stack

<div align="center">

| Layer | Technology |
|:---|:---|
| **Web Frontend** | Next.js · TypeScript · Tailwind CSS · shadcn/ui · Zustand |
| **Mobile App** | React Native · Expo · TypeScript |
| **Backend API** | NestJS · Prisma · PostgreSQL |
| **Real-Time Signaling** | Socket.IO |
| **WebRTC Media** | mediasoup (SFU) |
| **Cache / Pub-Sub** | Redis |
| **Storage / CDN** | AWS S3 (or Cloudflare R2) · Cloudflare CDN |
| **Transcoding** | FFmpeg (via BullMQ workers) |
| **Browser Extension** | Plasmo (Chrome / Edge / Firefox) |
| **Monorepo** | Turborepo |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry · Grafana / Prometheus |

</div>

---

## 📂 Project Structure

```
live-connect/
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/        # React Native (Expo) mobile app
│   ├── api/          # NestJS REST API (auth, rooms, profiles)
│   ├── signaling/      # Socket.IO + mediasoup SFU server
│   └── extension/      # Plasmo browser extension (streaming sync)
├── packages/
│   ├── types/         # Shared TypeScript types
│   ├── sync-protocol/  # Shared sync event schemas
│   └── config/        # Shared ESLint / TSConfig
└── turbo.json
```

---

## 🚀 Core Features

- 🔄 **Real-time playback sync** for YouTube, uploaded video (HLS), and screen shares
- 🎥 **Live video & audio chat** with grid / theater layout modes
- 💬 **Text chat** with emojis and floating **reaction overlays**
- 🧩 **Browser extension** for syncing Netflix, Prime Video, Disney+, and more
- 📋 **Playlists/queues** — line up multiple videos for a session
- 🔐 **Full account system** — email/password + OAuth, profiles, friends, room history
- 🛡️ **Room controls** — private/public rooms, passwords, host transfer, kick/ban
- 📱 **Native mobile apps** for iOS and Android

---

## 🏁 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/live-connect.git
cd live-connect

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start dev environment (Docker for Postgres + Redis)
docker compose up -d

# Run all apps in dev mode
npm run dev
```

> 📖 See [`docs/`](./docs) for detailed setup of the API, signaling server, mobile app, and browser extension.

---

## 🗺️ Roadmap

- [x] Project planning & architecture
- [ ] Auth & room management
- [ ] Sync engine (YouTube/embeddable)
- [ ] WebRTC video/audio chat
- [ ] Direct video upload & transcoding
- [ ] Browser extension (Netflix, Prime Video)
- [ ] Mobile apps (iOS/Android)
- [ ] Public beta launch

---

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss major changes before submitting a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch and open a PR

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for movie nights, watch parties, and long-distance friendships.

</div>
