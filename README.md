# TaskFlow 📋

> **Kanban-inspired mobile task management — built for individuals and teams.**

TaskFlow là ứng dụng di động quản lý công việc hiện đại, kết hợp bảng Kanban cộng tác nhóm theo phong cách Trello với hệ thống quản lý Todo cá nhân kiểu Todoist — tất cả trong một nền tảng duy nhất. Ứng dụng cho phép đồng bộ real-time giữa các thiết bị và hỗ trợ automation workflow giúp đội nhóm làm việc thông minh hơn, không chỉ chăm chỉ hơn.

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

## ✨ Tính Năng Nổi Bật

- 🗂️ **Kanban Board đầy đủ** — Tổ chức công việc theo cấu trúc Workspace → Board → List → Card với khả năng kéo-thả (drag & drop) linh hoạt.
- 👥 **Cộng tác nhóm** — Mời thành viên vào Workspace/Board với hệ thống phân quyền chi tiết (OWNER, ADMIN, MEMBER, VIEWER).
- ✅ **Todo cá nhân** — Mỗi người dùng có danh sách Todo riêng với priority (low / medium / high / urgent), dueDate và status (todo / doing / done).
- 🔄 **Chuyển đổi Todo → Card** — Chuyển một Todo cá nhân thành Kanban Card trên bất kỳ Board nào chỉ bằng vài thao tác.
- 📝 **Checklist chi tiết** — Mỗi Card có thể chứa nhiều Checklist với các mục con có thể tích dấu hoàn thành.
- 🏷️ **Label & Tags** — Gắn label màu sắc tùy chỉnh cho Card để phân loại công việc trực quan.
- 🤖 **Automation Rules** — Tạo quy tắc tự động hóa theo mô hình Trigger → Condition → Action (ví dụ: khi Card chuyển sang "Done" → tự tạo Todo mới).
- 🔔 **Thông báo thời gian thực** — Nhận thông báo khi được giao việc, khi Card được cập nhật, hoặc khi deadline đến gần.
- 📊 **Activity Log** — Lịch sử toàn bộ hoạt động theo Board, Card, hoặc cá nhân.
- 🔐 **Xác thực bảo mật** — JWT Access Token + Refresh Token lưu trong HttpOnly Cookie, mật khẩu mã hóa bằng bcrypt.
- 📱 **Đa nền tảng** — Chạy trên Android, iOS và Web từ một codebase duy nhất nhờ Expo.

---

## 🛠️ Tech Stack

### 📱 Mobile Client
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React Native | 0.81.5 | Framework UI đa nền tảng |
| Expo | ~54.0 | Build & development toolchain |
| Expo Router | ~6.0 | File-based routing |
| TypeScript | ~5.9 | Type safety |
| Zustand | ^5.0 | Global state management |
| React Navigation | ^7.0 | Navigation & tabs |
| Axios | ^1.16 | HTTP client |
| React Native Reanimated | ~4.1 | Animations mượt mà |
| React Native Draggable FlatList | ^4.0 | Kéo-thả Card/List |
| React Native Calendars | ^1.1314 | Hiển thị lịch dueDate |
| Zod | ^4.3 | Schema validation |
| Day.js | ^1.11 | Xử lý ngày giờ |
| Expo Secure Store | ~15.0 | Lưu token an toàn |
| Inter Font (Google Fonts) | ^0.4 | Typography chất lượng |

### ⚙️ Backend Server
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| Node.js | ≥ 20 | Runtime |
| Express | ^5.2 | Web framework |
| TypeScript | ^5.9 | Type safety |
| Prisma ORM | ^7.4 | Database access layer |
| PostgreSQL | ≥ 15 | Relational database |
| JSON Web Token | ^9.0 | Access & Refresh token |
| bcrypt | ^6.0 | Password hashing |
| Zod | ^4.3 | Request validation |
| Morgan | ^1.10 | HTTP request logging |
| CORS | ^2.8 | Cross-origin configuration |
| tsx | ^4.21 | TypeScript runner (dev) |

### 🗄️ Database
- **PostgreSQL** — Relational database với schema được quản lý bởi Prisma Migrations
- **Prisma ORM** — Type-safe database client với Prisma Studio để quản lý dữ liệu

### 🛠️ Dev Tools
- **Postman** — API testing (collection có sẵn tại `Trello_API_Postman_Collection.json`)
- **Prisma Studio** — GUI quản lý database
- **tsx watch** — Hot-reload cho server development

---

## 📋 Yêu Cầu Hệ Thống (Prerequisites)

Trước khi cài đặt, hãy đảm bảo máy bạn đã có:

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---|---|---|
| Node.js | v20+ | `node --version` |
| npm | v10+ | `npm --version` |
| PostgreSQL | v15+ | `psql --version` |
| Expo CLI | Latest | `npx expo --version` |
| Git | Any | `git --version` |

> **Lưu ý cho Mobile:** Cần có Android Studio (Emulator) hoặc app **Expo Go** trên điện thoại thật để chạy client.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1: Clone repository

```bash
git clone https://github.com/ZzzNTKzzZ/TaskFlow.git
cd TaskFlow
```

---

### Bước 2: Cài đặt Backend (Server)

```bash
cd server
npm install
```

Tạo file `.env` từ mẫu và cấu hình biến môi trường:

```bash
# Tạo file .env trong thư mục server/
```

```env
# server/.env

# Chuỗi kết nối PostgreSQL
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/TaskFlow"

# Cổng server
PORT=5000

# Khóa bí mật JWT (thay bằng chuỗi ngẫu nhiên mạnh của bạn)
JWT_SECRET="your_strong_jwt_access_secret_here"
JWT_REFRESH_SECRET="your_strong_jwt_refresh_secret_here"
```

Khởi tạo database và chạy migration:

```bash
# Tạo database và chạy migration
npx prisma migrate dev --name init

# (Tuỳ chọn) Mở Prisma Studio để quản lý dữ liệu
npx prisma studio
```

Khởi động server ở chế độ Development:

```bash
npm run dev
# Server sẽ lắng nghe tại: http://localhost:5000
```

---

### Bước 3: Cài đặt Mobile Client

Mở terminal mới, quay về thư mục gốc:

```bash
cd ../client
npm install
```

Tạo file `.env` cho client:

```env
# client/.env

# Thay bằng IP LAN của máy chạy server (KHÔNG dùng localhost)
EXPO_PUBLIC_API_URL=http://192.168.x.x:5000
```

> **Quan trọng:** Thay `192.168.x.x` bằng địa chỉ IP thực của máy tính bạn trong mạng LAN.
> Kiểm tra IP bằng lệnh `ipconfig` (Windows) hoặc `ifconfig` (macOS/Linux).

Khởi động client:

```bash
# Khởi động Expo Development Server
npx expo start

# Hoặc chạy thẳng trên Android Emulator
npx expo start --android

# Hoặc chạy trên iOS Simulator (chỉ macOS)
npx expo start --ios

# Hoặc chạy trên trình duyệt Web
npx expo start --web
```

Quét QR code hiện ra bằng ứng dụng **Expo Go** trên điện thoại thật để xem app.

---

### Chạy Production Build (Client)

```bash
# Build Android APK (cần EAS CLI)
npx eas build --platform android --profile preview

# Build iOS (cần Apple Developer Account)
npx eas build --platform ios
```

---

## 📡 Cách Sử Dụng & Ví Dụ API

Base URL: `http://localhost:5000/api/v1`

Toàn bộ Postman Collection có sẵn tại file [`Trello_API_Postman_Collection.json`](./Trello_API_Postman_Collection.json) — import thẳng vào Postman để test ngay.

### 🔐 Authentication

```http
# Đăng ký tài khoản mới
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "nguyenvana@example.com",
  "password": "securePassword123"
}

# Phản hồi thành công (201 Created):
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "uuid-here",
    "name": "Nguyen Van A",
    "email": "nguyenvana@example.com"
  }
}
```

```http
# Đăng nhập
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "nguyenvana@example.com",
  "password": "securePassword123"
}

# Phản hồi (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": { "id": "...", "name": "Nguyen Van A", "email": "..." }
}
```

### 🗂️ Workspace & Board

```http
# Lấy danh sách workspace của người dùng
GET /api/v1/workspaces
Authorization: Bearer <accessToken>

# Tạo board mới trong workspace
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
# Tạo card mới trong một list
POST /api/v1/:boardId/lists/:listId/cards
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Implement Authentication Module",
  "description": "Xây dựng JWT Auth với refresh token",
  "priority": "high",
  "dueDate": "2026-06-30T23:59:00.000Z"
}

# Di chuyển card sang list khác (reorder)
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
# Xem toàn bộ lịch sử hoạt động của một board
GET /api/v1/activities/board/:boardId
Authorization: Bearer <accessToken>

# Xem lịch sử hoạt động cá nhân
GET /api/v1/activities/me
Authorization: Bearer <accessToken>
```

---

## 📁 Cấu Trúc Dự Án

```
TaskFlow/
├── 📁 server/                  # Backend API
│   ├── src/
│   │   ├── app.ts              # Entry point Express
│   │   ├── routes/             # Đăng ký tất cả routes
│   │   ├── middleware/         # Auth, Error, Permission
│   │   ├── permissions/        # Định nghĩa quyền truy cập
│   │   ├── modules/            # Business logic
│   │   │   ├── Auth/
│   │   │   ├── Workspace/
│   │   │   ├── Board/
│   │   │   ├── List/
│   │   │   ├── Card/
│   │   │   ├── Checklist/
│   │   │   ├── Activity/
│   │   │   └── Automation/
│   │   ├── validators/         # Zod schemas validation
│   │   ├── lib/                # Prisma client setup
│   │   └── utils/              # Helper functions
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── package.json
│
├── 📁 client/                  # React Native (Expo) App
│   ├── app/                    # Expo Router (file-based routes)
│   │   ├── (auth)/             # Login, Register
│   │   ├── (tabs)/             # Tab navigation chính
│   │   ├── (board)/            # Board detail screens
│   │   ├── (card)/             # Card detail screens
│   │   └── (workspace)/        # Workspace screens
│   ├── components/             # Reusable UI components
│   ├── modules/                # Feature modules
│   ├── services/               # API service calls (axios)
│   ├── helper/                 # Utility functions
│   ├── theme/                  # Design tokens & colors
│   └── types/                  # TypeScript type definitions
│
├── Api.md                      # API endpoint reference
├── Design.md                   # Design system documentation
├── Mermaid.md                  # Architecture diagrams
└── README.md
```

---

## 🗺️ Lộ Trình Phát Triển

| Giai đoạn | Tính năng | Trạng thái |
|---|---|---|
| **Phase 1** | Authentication, Workspace, Board, List, Card | ✅ Hoàn thành |
| **Phase 2** | Real-time sync, Drag & Drop, Team members | ✅ Hoàn thành |
| **Phase 3** | Todo system, Checklist, Todo-to-Card conversion | ✅ Hoàn thành |
| **Phase 4** | Automation Rules, Notifications, Activity Log | ✅ Hoàn thành |
| **Phase 5** | Push Notifications (FCM), Performance optimization | 🚧 Đang phát triển |

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/your-feature-name`
3. Commit thay đổi: `git commit -m 'feat: add some feature'`
4. Push lên branch: `git push origin feature/your-feature-name`
5. Mở Pull Request

---

## 📝 License

Dự án này được cấp phép theo [ISC License](./package.json).

---

<div align="center">

**Made with ❤️ by [ZzzNTKzzZ](https://github.com/ZzzNTKzzZ)**

⭐ Nếu dự án này hữu ích, hãy cho một ngôi sao trên GitHub!

[![GitHub stars](https://img.shields.io/github/stars/ZzzNTKzzZ/TaskFlow?style=social)](https://github.com/ZzzNTKzzZ/TaskFlow)

</div>
