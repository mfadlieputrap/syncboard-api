# 🚀 SyncBoard - Realtime Kanban Backend

SyncBoard is a scalable, real-time collaboration platform backend built with **NestJS**, designed to handle high-concurrency WebSocket connections using **Valkey (Redis)** adapter.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Valkey](https://img.shields.io/badge/Valkey-FF4400?style=for-the-badge&logo=redis&logoColor=white)

## 🏗️ Architecture

The system uses a **Pub/Sub architecture** to allow horizontal scaling. WebSocket events are distributed across multiple server instances via Valkey (Redis fork).

```mermaid
graph TD;
    Client_A[User A] -->|WebSocket| LB[Load Balancer / Docker Port];
    Client_B[User B] -->|WebSocket| LB;
    LB --> Server_1[NestJS Instance 1];
    LB --> Server_2[NestJS Instance 2];
    Server_1 <-->|Pub/Sub Events| Valkey[(Valkey/Redis)];
    Server_2 <-->|Pub/Sub Events| Valkey;
    Server_1 -->|Persist Data| DB[(PostgreSQL)];
    Server_2 -->|Persist Data| DB;
```
## 🔥 Key Features
- Real-time Synchronization: Using Socket.io with Rooms support.

- Scalable Architecture: Integrated @socket.io/redis-adapter using Valkey for multi-server communication.

- Optimized Database: Using Prisma ORM with connection pooling.

- Smart Ordering: Implements Lexorank-style (Floating point) logic for efficient Drag-and-Drop persistence (O(1) complexity).

- Dockerized: Fully containerized environment (App + DB + Cache) using Multi-stage builds.

## 🛠️ Tech Stack
- Framework: NestJS (Node.js)

- Database: PostgreSQL 15

- ORM: Prisma

- Cache/PubSub: Valkey (Open Source Redis alternative)

- Container: Docker & Docker Compose

## 🚀 Getting Started
You don't need to install Node.js or PostgreSQL locally. Just use Docker.

### Prerequisites
Docker & Docker Compose installed.

### Run the App
```Bash

# 1. Clone the repo
git clone [https://github.com/username/syncboard.git](https://github.com/username/syncboard.git)
cd syncboard

# 2. Start the magic (Builds App, DB, and Valkey)
docker-compose up --build
```
The API will be available at http://localhost:3000.

## 🧪 How to Test (WebSocket)
- Open client-test.html in your browser.

- Enter a Board ID (e.g., board-1) and click Join.

- Open another tab, join the same Board ID.

- Send a message or simulate a Card Move.

- Watch the real-time magic happen across tabs!

## 📂 Project Structure
```bash
src/  
├── boards/          # Module for Board & Card logic (Gateway + Controller)  
├── prisma/          # Global Prisma Database Module  
├── redis-io.adapter # Custom Adapter for Valkey/Redis connection  
├── app.module.ts    # Main Application Module  
└── main.ts          # Entry point  
```

Built with ❤️ by Muhamad Fadlie