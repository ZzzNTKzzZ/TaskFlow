export type TodoStatus = "todo" | "doing" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";
export type BoardVisibility = "private" | "workspace" | "public";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
export type ActivityType =
  | "BOARD_CREATED" | "BOARD_UPDATED" | "BOARD_DELETED"
  | "LIST_CREATED" | "LIST_UPDATED" | "LIST_DELETED" | "LIST_MOVED"
  | "CARD_CREATED" | "CARD_UPDATED" | "CARD_DELETED" | "CARD_MOVED" | "CARD_ASSIGNED"
  | "COMMENT_CREATED" | "COMMENT_UPDATED" | "COMMENT_DELETED"
  | "CHECKLIST_CREATED" | "CHECKLIST_UPDATED" | "CHECKLIST_ITEM_COMPLETED";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  password?: string;
  createdAt: Date | string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
}

export interface Board {
  id: string;
  name: string;
  background?: string | null;
  visibility: BoardVisibility;
  workspaceId: string;
  position: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BoardMember {
  id: string;
  userId: string;
  boardId: string;
}

export interface List {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Card {
  id: string;
  name: string;
  description?: string | null;
  position: number;
  dueDate?: Date | string | null;
  listId: string;
  priority: Priority;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CardAssignee {
  id: string;
  userId: string;
  cardId: string;
}

export interface Comment {
  id: string;
  cardId: string;
  authorId: string;
  content: string;
  createdAt: Date | string;
}

export interface Checklist {
  id: string;
  name: string;
  cardId: string;
  createdAt: Date | string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  isCompleted: boolean;
  checklistId: string;
}

export interface Todo {
  id: string;
  name: string;
  description?: string | null;
  status: TodoStatus;
  priority: Priority;
  dueDate?: Date | string | null;
  userId: string;
  createdAt: Date | string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface LabelOnCard {
  id: string;
  cardId: string;
  labelId: string;
}

export interface Notification {
  id: string;
  userId: string;
  name: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface AutomationRule {
  id: string;
  boardId: string;
  trigger: string;
  condition: any;
  action: any;
  createdAt: Date | string;
}

export interface ActivityLog {
  id: string;
  boardId: string;
  userId: string;
  cardId?: string | null;
  listId?: string | null;
  action: ActivityType;
  description: string;
  metadata?: any | null;
  createdAt: Date | string;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date | string;
  createdAt: Date | string;
}

export type Visibility = BoardVisibility;
export type RoleWorkspace = WorkspaceRole;

