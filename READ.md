# 📘 MOBILE TASK MANAGEMENT SYSTEM 2026

## Kanban + Personal Todo + Automation

---

## 1. System Overview

### Goal

Build a **mobile task management application** similar to Trello that also integrates **personal todo management** like Todoist or Microsoft To Do.

Main capabilities:

* Kanban board for team collaboration
* Personal todo management
* Real-time updates across devices
* Automation workflow
* Reminder and notifications

---

## 2. System Architecture

Mobile App (Flutter / React Native)

↓ REST API + WebSocket

Backend (Node.js)

↓

PostgreSQL Database

↓

Firebase Cloud Messaging

---

## 3. Core Features

### 3.1 Kanban Board

Structure

Workspace

Board

List

Card

Capabilities

* Create boards
* Create lists
* Create cards
* Drag and drop cards
* Invite members
* Assign cards

---

### 3.2 Real‑time Collaboration

The system synchronizes board updates instantly between devices.

Example

User A moves a card

User B sees the change immediately

Technology

* WebSocket
* Socket.IO

Events

* card_created
* card_updated
* card_moved
* card_assigned

---

### 3.3 Personal Todo List

Each user has a personal todo list.

Todo fields

* title
* description
* priority
* dueDate
* status (todo / doing / done)

Features

* Create todo
* Edit todo
* Complete todo
* Delete todo

---

### 3.4 Convert Todo to Board Task

Users can convert a personal todo into a Kanban card.

Flow

Todo

→ Convert

→ Select Board + List

→ Create Card

---

### 3.5 Card Checklist

Each card can contain multiple checklist items.

Example

[ ] Design database

[ ] Implement API

[ ] Write tests

[ ] Deploy

---

### 3.6 Reminder and Notification

The application sends notifications when:

* A task is near deadline
* A card is assigned to the user
* A card is updated

Notification service

Firebase Cloud Messaging

---

### 3.7 Automation Rules

Users can create workflow automation rules.

Example rule

Trigger

Card moved to Done

Action

Create new todo

Architecture

Event → Rule Engine → Condition → Action

---

## 4. Database Design (Prisma + PostgreSQL)

Main tables

* User
* Workspace
* Board
* List
* Card
* Todo
* Checklist
* ChecklistItem
* Comment
* Notification
* AutomationRule

---

### Example Prisma Schema

```prisma
model User {
 id String @id @default(uuid())
 email String @unique
 name String?
 createdAt DateTime @default(now())
}

model Board {
 id String @id @default(uuid())
 title String
 createdAt DateTime @default(now())
}

model List {
 id String @id @default(uuid())
 title String
 boardId String
}

model Card {
 id String @id @default(uuid())
 title String
 description String?
 listId String
}

model Todo {
 id String @id @default(uuid())
 title String
 description String?
 status String
}
```

---

## 5. Main APIs

Authentication

POST /auth/register

POST /auth/login

Board

GET /boards

POST /boards

Card

POST /cards

PATCH /cards/:id

Todo

GET /todos

POST /todos

POST /todos/:id/convert

---

## 6. Application Workflow

Create card flow

User → Mobile App

↓

API Request

↓

Backend

↓

PostgreSQL

↓

WebSocket broadcast

↓

Other devices update UI

---

## 7. Development Roadmap

Phase 1

Authentication

Board

List

Card

Phase 2

Real-time sync

Drag and drop

Team members

Phase 3

Todo system

Checklist

Todo to Card conversion

Phase 4

Automation rules

Notifications

Performance optimization

---

## 8. Full Prisma Schema

```prisma
// datasource

datasource db {
 provider = "postgresql"
 url      = env("DATABASE_URL")
}

// generator

generator client {
 provider = "prisma-client-js"
}

// ENUMS

enum TodoStatus {
 todo
 doing
 done
}

enum Priority {
 low
 medium
 high
 urgent
}

enum BoardVisibility {
 private
 workspace
 public
}

enum WorkspaceRole {
 OWNER
 ADMIN
 MEMBER
 VIEWER
}

// MODELS

model User {
 id        String   @id @default(uuid())
 email     String   @unique
 name      String?
 password  String
 createdAt DateTime @default(now())

 workspaces WorkspaceMember[]
 boards     BoardMember[]
 cards      CardAssignee[]
 todos      Todo[]
 comments   Comment[]
 notifications Notification[]
}

model Workspace {
 id        String   @id @default(uuid())
 name      String
 slug      String   @unique
 createdAt DateTime @default(now())

 members WorkspaceMember[]
 boards  Board[]
}

model WorkspaceMember {
 id          String        @id @default(uuid())
 userId      String
 workspaceId String
 role        WorkspaceRole

 user      User      @relation(fields: [userId], references: [id])
 workspace Workspace @relation(fields: [workspaceId], references: [id])

 @@unique([userId, workspaceId])
}

model Board {
 id          String          @id @default(uuid())
 title       String
 background  String?
 visibility  BoardVisibility
 workspaceId String
 position    Float
 createdAt   DateTime        @default(now())

 workspace Workspace @relation(fields: [workspaceId], references: [id])
 lists     List[]
 members   BoardMember[]
 rules     AutomationRule[]
}

model BoardMember {
 id      String @id @default(uuid())
 userId  String
 boardId String

 user  User  @relation(fields: [userId], references: [id])
 board Board @relation(fields: [boardId], references: [id])

 @@unique([userId, boardId])
}

model List {
 id       String  @id @default(uuid())
 title    String
 position Float
 boardId  String

 board Board @relation(fields: [boardId], references: [id])
 cards Card[]
}

model Card {
 id          String   @id @default(uuid())
 title       String
 description String?
 position    Float
 dueDate     DateTime?
 listId      String
 createdAt   DateTime @default(now())

 list        List            @relation(fields: [listId], references: [id])
 assignees   CardAssignee[]
 comments    Comment[]
 checklists  Checklist[]
 labels      LabelOnCard[]
}

model CardAssignee {
 id     String @id @default(uuid())
 userId String
 cardId String

 user User @relation(fields: [userId], references: [id])
 card Card @relation(fields: [cardId], references: [id])

 @@unique([userId, cardId])
}

model Comment {
 id        String   @id @default(uuid())
 cardId    String
 authorId  String
 content   String
 createdAt DateTime @default(now())

 card   Card @relation(fields: [cardId], references: [id])
 author User @relation(fields: [authorId], references: [id])
}

model Checklist {
 id     String @id @default(uuid())
 title  String
 cardId String

 card  Card           @relation(fields: [cardId], references: [id])
 items ChecklistItem[]
}

model ChecklistItem {
 id          String  @id @default(uuid())
 title       String
 isCompleted Boolean @default(false)
 checklistId String

 checklist Checklist @relation(fields: [checklistId], references: [id])
}

model Todo {
 id          String     @id @default(uuid())
 title       String
 description String?
 status      TodoStatus
 priority    Priority
 dueDate     DateTime?
 userId      String
 createdAt   DateTime   @default(now())

 user User @relation(fields: [userId], references: [id])
}

model Label {
 id    String @id @default(uuid())
 name  String
 color String

 cards LabelOnCard[]
}

model LabelOnCard {
 id      String @id @default(uuid())
 cardId  String
 labelId String

 card  Card  @relation(fields: [cardId], references: [id])
 label Label @relation(fields: [labelId], references: [id])

 @@unique([cardId, labelId])
}

model Notification {
 id        String   @id @default(uuid())
 userId    String
 title     String
 message   String
 isRead    Boolean  @default(false)
 createdAt DateTime @default(now())

 user User @relation(fields: [userId], references: [id])
}

model AutomationRule {
 id        String   @id @default(uuid())
 boardId   String
 trigger   String
 condition Json
 action    Json
 createdAt DateTime @default(now())

 board Board @relation(fields: [boardId], references: [id])
}
```

---

## Conclusion

This system combines:

* Kanban team collaboration
* Personal productivity tools
* Real-time communication
* Workflow automation

It enables efficient task management on mobile devices for both individuals and teams.
