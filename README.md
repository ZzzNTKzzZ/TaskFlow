# TaskFlow 📋

> **A Kanban-inspired task management platform built for both individuals and teams.**

TaskFlow is a modern cross-platform task management application that combines Trello-style collaborative Kanban boards with Todoist-inspired personal productivity features in a single unified platform. The application supports real-time synchronization across devices and workflow automation, enabling teams to work smarter, not just harder.

---

## ✨ Key Features

* 🗂️ **Full Kanban Board System** — Organize tasks using a Workspace → Board → List → Card hierarchy with flexible drag-and-drop interactions.
* 👥 **Team Collaboration** — Invite members to Workspaces and Boards with granular role-based access control (OWNER, ADMIN, MEMBER, VIEWER).
* ✅ **Personal Todo Management** — Each user has a private Todo list with priority levels (Low / Medium / High / Urgent), due dates, and status tracking (Todo / Doing / Done).
* 🔄 **Todo-to-Card Conversion** — Convert personal Todos into Kanban Cards on any Board with just a few clicks.
* 📝 **Advanced Checklists** — Cards can contain multiple checklists with nested items and completion tracking.
* 🏷️ **Labels & Tags** — Assign custom-colored labels to visually categorize and organize work.
* 🤖 **Automation Rules** — Create workflow automations using a Trigger → Condition → Action model.
* 🔔 **Real-Time Notifications** — Receive notifications for task assignments, card updates, and upcoming deadlines.
* 📊 **Activity Logs** — Track all activities across Boards, Cards, and personal workspaces.
* 🔐 **Secure Authentication** — JWT Access Tokens + Refresh Tokens with bcrypt password hashing.
* 📱 **Cross-Platform Support** — Available on Android, iOS, and Web from a single codebase powered by Expo.

---

## 🚀 Why TaskFlow?

Most productivity tools focus on either **personal task management** or **team collaboration**.

TaskFlow bridges both worlds by providing:

* A Trello-inspired Kanban workflow for teams.
* A Todoist-inspired personal productivity system.
* Seamless conversion between personal tasks and collaborative work items.
* Real-time synchronization across devices.
* Workflow automation that reduces repetitive manual work.

The result is a unified productivity ecosystem where users can manage both personal and team responsibilities without switching between multiple applications.

---

## 🛠️ Tech Stack

### Mobile Application

* React Native
* Expo
* TypeScript
* Expo Router
* Zustand
* React Navigation
* Axios
* React Native Reanimated
* React Native Draggable FlatList
* React Native Calendars
* Zod
* Day.js
* Expo Secure Store

### Backend Services

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* bcrypt
* Zod Validation

### Development Tools

* Postman
* Prisma Studio
* Git & GitHub
* tsx watch

---

## 🏗️ Architecture Overview

```text
Workspace
 ├── Board
 │    ├── List
 │    │    ├── Card
 │    │    │    ├── Checklist
 │    │    │    ├── Labels
 │    │    │    └── Activities
 │
 └── Members
```

---

## 🔐 Security Features

* JWT-based Authentication
* Refresh Token Mechanism
* Password Hashing with bcrypt
* Role-Based Access Control (RBAC)
* Protected API Endpoints
* Input Validation using Zod

---

## 📊 Core Modules

### Authentication Module

* User Registration
* Login & Logout
* Token Refresh
* Profile Management

### Workspace Module

* Workspace Creation
* Member Invitation
* Permission Management

### Board Module

* Board Creation
* Board Visibility Settings
* Team Collaboration

### Card Module

* Create & Update Cards
* Due Dates
* Priorities
* Labels
* Assignments

### Todo Module

* Personal Task Management
* Priority Tracking
* Status Management
* Todo-to-Card Conversion

### Automation Module

* Trigger-Based Rules
* Conditional Workflows
* Automated Task Creation

### Activity Module

* Board Activity Logs
* User Activity History
* Audit Trail Tracking

---

## 🎯 Future Roadmap

### Phase 5 — Currently In Progress

* Push Notifications (FCM)
* Performance Optimization
* Background Synchronization
* Offline Support

### Phase 6 — Planned Features

* AI-Powered Task Suggestions
* Smart Priority Recommendations
* Productivity Analytics Dashboard
* Calendar Integration
* Google Workspace Integration
* Microsoft 365 Integration

### Long-Term Vision

Transform TaskFlow into a complete productivity platform that combines:

* Project Management
* Personal Productivity
* Team Collaboration
* Workflow Automation
* AI Assistance

within a single unified ecosystem.

---

## 📈 Learning Outcomes

Through building TaskFlow, key software engineering concepts were applied:

* Full-Stack Application Development
* Mobile Application Architecture
* REST API Design
* Authentication & Authorization
* Database Modeling
* State Management
* Real-Time Communication
* Workflow Automation
* Scalable Project Structure
* Clean Architecture Principles

---

## 👨‍💻 Author

**Nguyen Tuan Khanh**

Software Engineer focused on:

* Backend Development
* Mobile Development
* System Design
* Database Engineering
* Workflow Automation

---

## ⭐ Project Status

**Active Development**

TaskFlow continues to evolve with new features, performance improvements, and automation capabilities aimed at creating a next-generation productivity experience.
