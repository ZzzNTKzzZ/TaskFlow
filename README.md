# TaskFlow 📋

> **Kanban-inspired mobile task management — built for individuals and teams.**

TaskFlow is a modern mobile task management application that combines Trello-style collaborative Kanban boards with a personal Todo system inspired by Todoist — all in a single platform. It enables real-time synchronization across devices and supports automation workflows, helping teams work smarter, not just harder.

---

## Badges

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![GitHub](https://img.shields.io/badge/GitHub-ZzzNTKzzZ%2FTaskFlow-181717?style=for-the-badge&logo=github&logoColor=white)

---

## ✨ Key Features

- 🗂️ **Full-featured Kanban Board** — Organize work through a Workspace → Board → List → Card hierarchy with flexible drag & drop support.
- 👥 **Team Collaboration** — Invite members to Workspaces and Boards with a granular role-based permission system (OWNER, ADMIN, MEMBER, VIEWER).
- ✅ **Personal Todo List** — Each user has a private Todo list with priority levels (low / medium / high / urgent), due dates, and statuses (todo / doing / done).
- 🔄 **Todo → Card Conversion** — Promote a personal Todo into a Kanban Card on any Board in just a few taps.
- 📝 **Detailed Checklists** — Each Card can contain multiple Checklists with completable sub-items to track granular progress.
- 🏷️ **Labels & Tags** — Attach custom color-coded labels to Cards for fast visual categorization.
- 🤖 **Automation Rules** — Build workflow automations using a Trigger → Condition → Action model (e.g., when a Card moves to "Done" → automatically create a new Todo).
- 🔔 **Real-time Notifications** — Get notified when you are assigned to a task, when a Card is updated, or when a deadline is approaching.
- 📊 **Activity Log** — Full audit history of all actions, scoped to a Board, a Card, or a specific user.
- 🔐 **Secure Authentication** — JWT Access Token + Refresh Token stored in HttpOnly Cookies, with passwords hashed using bcrypt.
- 📱 **Cross-platform** — Runs on Android, iOS, and Web from a single codebase powered by Expo.

---

## 🛠️ Tech Stack

### 📱 Mobile Client
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Cross-platform UI framework |
| Expo | ~54.0 | Build & development toolchain |
| Expo Router | ~6.0 | File-based navigation routing |
| TypeScript | ~5.9 | Static type safety |
| Zustand | ^5.0 | Global state management |
| React Navigation | ^7.0 | Navigation & tab management |
| Axios | ^1.16 | HTTP client for API calls |
| React Native Reanimated | ~4.1 | Smooth animations |
| React Native Draggable FlatList | ^4.0 | Drag & drop for Cards/Lists |
| React Native Calendars | ^1.1314 | Due date calendar view |
| Zod | ^4.3 | Schema & form validation |
| Day.js | ^1.11 | Date/time manipulation |
| Expo Secure Store | ~15.0 | Secure token storage |
| Inter Font (Google Fonts) | ^0.4 | Premium typography |

### ⚙️ Backend Server
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 20 | JavaScript runtime |
| Express | ^5.2 | Web application framework |
| TypeScript | ^5.9 | Static type safety |
| Prisma ORM | ^7.4 | Type-safe database access layer |
| PostgreSQL | ≥ 15 | Relational database |
| JSON Web Token | ^9.0 | Access & Refresh token issuance |
| bcrypt | ^6.0 | Password hashing |
| Zod | ^4.3 | Request body validation |
| Morgan | ^1.10 | HTTP request logging |
| CORS | ^2.8 | Cross-origin resource sharing |
| tsx | ^4.21 | TypeScript runner for development |

### 🗄️ Database
- **PostgreSQL** — Relational database with schema managed through Prisma Migrations.
- **Prisma ORM** — Type-safe database client with Prisma Studio for GUI-based data management.

### 🛠️ Dev Tools
- **Postman** — API testing (ready-to-import collection at `Trello_API_Postman_Collection.json`)
- **Prisma Studio** — Visual GUI for managing database records
- **tsx watch** — Hot-reload TypeScript runner for server development

---

## 📋 Prerequisites

Before installing, ensure your machine has the following:

| Tool | Minimum Version | Check Command |
|---|---|---|
| Node.js | v20+ | `node --version` |
| npm | v10+ | `npm --version` |
| PostgreSQL | v15+ | `psql --version` |
| Expo CLI | Latest | `npx expo --version` |
| Git | Any | `git --version` |

> **Mobile Note:** You need Android Studio (with an emulator) or the **Expo Go** app on a physical device to run the client.

---

## 🚀 Installation & Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/ZzzNTKzzZ/TaskFlow.git
cd TaskFlow
```

---

### Step 2: Set up the Backend (Server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory and configure the environment variables:

```env
# server/.env

# PostgreSQL connection string
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/TaskFlow"

# Server port
PORT=5000

# JWT secrets (replace with strong random strings)
JWT_SECRET="your_strong_jwt_access_secret_here"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_here"
```

Initialize the database and run migrations:

```bash
# Run Prisma migration to create the database schema
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to browse your data
npx prisma studio
```

Start the server in development mode:

```bash
npm run dev
# Server will be listening at: http://localhost:5000
```

---

### Step 3: Set up the Mobile Client

Open a new terminal and navigate to the client directory:

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
# client/.env

# Replace with the LAN IP address of the machine running the server (do NOT use localhost)
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000
```

> **Important:** Replace `192.168.x.x` with your machine's actual local IP address.
> Find it with `ipconfig` (Windows) or `ifconfig` (macOS/Linux).

Start the Expo development server:

```bash
# Start the Expo development server
npx expo start

# Run directly on Android Emulator
npx expo start --android

# Run on iOS Simulator (macOS only)
npx expo start --ios

# Run in the web browser
npx expo start --web
```

Scan the displayed QR code with the **Expo Go** app on a physical device to preview the app instantly.

---

### Production Build (Client)

```bash
# Build an Android APK (requires EAS CLI)
npx eas build --platform android --profile preview

# Build for iOS (requires an Apple Developer Account)
npx eas build --platform ios
```

---

## 📡 Usage & API Examples

**Base URL:** `http://localhost:5000/api/v1`

The full Postman Collection is available at [`Trello_API_Postman_Collection.json`](./Trello_API_Postman_Collection.json) — import it directly into Postman to start testing immediately.

### 🔐 Authentication

```http
# Register a new account
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

# Success response (201 Created):
{
  "message": "Registration successful",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

```http
# Log in to an existing account
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}

# Success response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": { "id": "...", "name": "John Doe", "email": "..." }
}
```

### 🗂️ Workspace & Board

```http
# Get all workspaces for the authenticated user
GET /api/v1/workspaces
Authorization: Bearer <accessToken>

# Create a new board inside a workspace
POST /api/v1/workspaces/:workspaceId/boards
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Sprint 2026 Q1",
  "visibility": "workspace",
  "background": "#2b3896"
}
```

### ✅ Card Management

```http
# Create a new card inside a list
POST /api/v1/:boardId/lists/:listId/cards
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Implement Authentication Module",
  "description": "Build JWT Auth with refresh token rotation",
  "priority": "high",
  "dueDate": "2026-06-30T23:59:00.000Z"
}

# Move a card to a different list (reorder)
PATCH /api/v1/:boardId/cards/reorder
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "cardId": "card-uuid",
  "newListId": "target-list-uuid",
  "newPosition": 1.5
}
```

### 📊 Activity Log

```http
# Fetch the full activity history for a board
GET /api/v1/activities/board/:boardId
Authorization: Bearer <accessToken>

# Fetch the current user's personal activity history
GET /api/v1/activities/me
Authorization: Bearer <accessToken>
```

---

## 📁 Project Structure

```
TaskFlow/
├── 📁 server/                  # Backend REST API
│   ├── src/
│   │   ├── app.ts              # Express entry point
│   │   ├── routes/             # Route registration
│   │   ├── middleware/         # Auth, Error, Permission middleware
│   │   ├── permissions/        # Role-based permission definitions
│   │   ├── modules/            # Feature-based business logic
│   │   │   ├── Auth/
│   │   │   ├── Workspace/
│   │   │   ├── Board/
│   │   │   ├── List/
│   │   │   ├── Card/
│   │   │   ├── Checklist/
│   │   │   ├── Activity/
│   │   │   └── Automation/
│   │   ├── validators/         # Zod request schemas
│   │   ├── lib/                # Prisma client initialization
│   │   └── utils/              # Shared utility functions
│   ├── prisma/
│   │   └── schema.prisma       # Database schema definition
│   └── package.json
│
├── 📁 client/                  # React Native (Expo) App
│   ├── app/                    # Expo Router file-based routes
│   │   ├── (auth)/             # Login & Register screens
│   │   ├── (tabs)/             # Main tab navigation
│   │   ├── (board)/            # Board detail screens
│   │   ├── (card)/             # Card detail screens
│   │   └── (workspace)/        # Workspace screens
│   ├── components/             # Reusable UI components
│   ├── modules/                # Feature modules
│   ├── services/               # Axios API service layer
│   ├── helper/                 # Utility/helper functions
│   ├── theme/                  # Design tokens & color palette
│   └── types/                  # Global TypeScript type definitions
│
├── Api.md                      # Full API endpoint reference
├── Design.md                   # Design system documentation
├── Mermaid.md                  # Architecture & flow diagrams
└── README.md
```

---

## 🗺️ Roadmap

| Phase | Features | Status |
|---|---|---|
| **Phase 1** | Authentication, Workspace, Board, List, Card | ✅ Complete |
| **Phase 2** | Real-time sync, Drag & Drop, Team members | ✅ Complete |
| **Phase 3** | Todo system, Checklist, Todo-to-Card conversion | ✅ Complete |
| **Phase 4** | Automation Rules, Notifications, Activity Log | ✅ Complete |
| **Phase 5** | Push Notifications (FCM), Performance optimization | 🚧 In Progress |

---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [ISC License](./package.json).

---

<div align="center">

**Made with ❤️ by [ZzzNTKzzZ](https://github.com/ZzzNTKzzZ)**

⭐ If you find this project useful, please consider giving it a star on GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ZzzNTKzzZ/TaskFlow?style=social)](https://github.com/ZzzNTKzzZ/TaskFlow)

</div>
