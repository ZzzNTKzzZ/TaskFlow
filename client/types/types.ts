/**
 * ============================================================================
 * 📊 TRELLO CLONE CENTRAL TS CONTRACT (types.ts)
 * ----------------------------------------------------------------------------
 * Staff-level TypeScript Definitions representing strict client-server contracts.
 * Matches all Express routing, controllers, and Prisma schemas exactly.
 * Includes known backend property typos (e.g. checkListCompelete) for runtime safety.
 * ============================================================================
 */

export type Priority = "low" | "medium" | "high" | "urgent";
export type BoardVisibility = "private" | "workspace" | "public";
export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

/**
 * Standard Backend success response helper wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Raw User Entity representing a database model.
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

/**
 * ============================================================================
 * 🏢 WORKSPACE MODULE TYPES
 * ============================================================================
 */

export interface WorkspaceStats {
  memberCount: number;
  boardCount: number;
  cardCount: number;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  stats?: WorkspaceStats;
  currentUser?: {
    role: WorkspaceRole;
  };
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: WorkspaceRole;
  user: User;
}

export interface GetWorkspacesQuery {
  limit?: number;
}

export interface GetWorkspaceParams {
  workspaceId: string;
}

export interface CreateWorkspaceBody {
  name: string;
}

export interface UpdateWorkspaceParams {
  workspaceId: string;
}

export interface UpdateWorkspaceBody {
  name: string;
}

export interface DeleteWorkspaceParams {
  workspaceId: string;
}

export interface GetWorkspaceMembersParams {
  workspaceId: string;
}

export interface AddWorkspaceMemberParams {
  workspaceId: string;
}

export interface AddWorkspaceMemberBody {
  email: string;
  role: WorkspaceRole;
}

export interface EditWorkspaceMemberParams {
  workspaceId: string;
  memberId: string;
}

export interface EditWorkspaceMemberBody {
  role: WorkspaceRole;
}

export interface DeleteWorkspaceMemberParams {
  workspaceId: string;
  memberId: string;
}

export interface GetWorkspaceBoardsParams {
  workspaceId: string;
}

export interface GetWorkspaceBoardsQuery {
  limit?: number;
}

export interface CreateWorkspaceBoardParams {
  workspaceId: string;
}

export interface CreateWorkspaceBoardBody {
  name: string;
  visibility: BoardVisibility;
  background?: string;
}

export interface ReorderWorkspaceBoardsParams {
  workspaceId: string;
}

export interface ReorderWorkspaceBoardsBody {
  boardId: string;
  beforeId?: string | null;
  afterId?: string | null;
}

export type GetWorkspacesResponse = Workspace[];
export type GetWorkspaceResponse = Workspace;
export type CreateWorkspaceResponse = Workspace & { role: WorkspaceRole };
export type UpdateWorkspaceResponse = Workspace;
export type DeleteWorkspaceResponse = { message: string };
export type GetWorkspaceMembersResponse = {
  id: string;
  name: string | null;
  email: string;
  role: WorkspaceRole;
}[];
export type AddWorkspaceMemberResponse = {
  id: string;
  name: string | null;
  email: string;
  role: WorkspaceRole;
};
export type EditWorkspaceMemberResponse = AddWorkspaceMemberResponse;
export type DeleteWorkspaceMemberResponse = { message: string };

/**
 * ============================================================================
 * 📋 BOARD MODULE TYPES
 * ============================================================================
 */

export interface Board {
  id: string;
  name: string;
  background: string | null;
  visibility: BoardVisibility;
  workspaceId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardMember {
  id: string;
  userId: string;
  boardId: string;
}

export interface GetBoardParams {
  boardId: string;
}

export interface EditBoardParams {
  boardId: string;
}

export interface EditBoardBody {
  name?: string;
  background?: string;
  visibility?: BoardVisibility;
  position?: number;
}

export interface DeleteBoardParams {
  boardId: string;
}

export interface GetBoardMembersParams {
  boardId: string;
}

export interface AddBoardMembersParams {
  boardId: string;
}

export interface AddBoardMembersBody {
  memberIds: string[];
}

export interface DeleteBoardMemberParams {
  boardId: string;
  userId: string;
}

export interface GetBoardListsParams {
  boardId: string;
}

export interface CreateBoardListParams {
  boardId: string;
}

export interface CreateBoardListBody {
  name: string;
}

export interface ReorderListsBody {
  boardId: string;
  listId: string;
  beforeId?: string | null;
  afterId?: string | null;
}

export interface BoardResponse extends Board {
  lists: (List & { cardCount: number })[];
  memberCount: number;
  currentUser?: { role: WorkspaceRole };
}

export type EditBoardResponse = Board & { memberCount: number };
export type DeleteBoardResponse = { message: string };
export type GetBoardMembersResponse = {
  id: string;
  userId: string;
  name: string | null;
}[];
export type AddBoardMembersResponse = {
  added: string[];
  skipped: string[];
};
export type DeleteBoardMemberResponse = { message: string };
export type GetBoardListsResponse = (List & { cardCount: number })[];
export type CreateBoardListResponse = List;
export type ReorderListsResponse = List;

/**
 * ============================================================================
 * 🗂️ LIST MODULE TYPES
 * ============================================================================
 */

export interface List {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditListParams {
  boardId: string;
  listId: string;
}

export interface EditListBody {
  name?: string;
  position?: number;
}

export interface DeleteListParams {
  boardId: string;
  listId: string;
}

export interface GetListCardsParams {
  boardId: string;
  listId: string;
}

export interface CreateCardInListParams {
  boardId: string;
  listId: string;
}

export interface CreateCardInListBody {
  name: string;
  description?: string;
  priority: Priority;
  dueDate?: string | null;
}

export type EditListResponse = List;
export type DeleteListResponse = List;
export type GetListCardsResponse = Card[];
export type CreateCardInListResponse = Card;

/**
 * ============================================================================
 * 🏷️ CARD MODULE TYPES
 * ============================================================================
 */

export interface Card {
  id: string;
  name: string;
  description: string | null;
  position: number;
  dueDate: string | null;
  listId: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface CardAssignee {
  id: string;
  userId: string;
  cardId: string;
  user: User;
}

export interface GetCardParams {
  boardId: string;
  cardId: string;
}

export interface UpdateCardParams {
  boardId: string;
  cardId: string;
}

export interface UpdateCardBody {
  title?: string;
  name?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  listId?: string;
  position?: number;
}

export interface ReorderCardParams {
  boardId: string;
}

export interface ReorderCardBody {
  cardId: string;
  targetListId: string;
  beforeId?: string | null;
  afterId?: string | null;
}

export interface DeleteCardParams {
  boardId: string;
  cardId: string;
}

export interface AssignCardUsersParams {
  boardId: string;
  cardId: string;
}

export interface AssignCardUsersBody {
  userIds: string[];
}

export interface UnassignCardUserParams {
  boardId: string;
  cardId: string;
  userId: string;
}

export interface GetCardResponse extends Card {
  stats: {
    checkListCount: number;
    checkListCompelete: number;
  };
  assignees: CardAssignee[];
  checklists: (Checklist & { items: ChecklistItem[] })[];
}

export type UpdateCardResponse = Card;
export type ReorderCardResponse = Card;
export type DeleteCardResponse = { message: string };
export type AssignCardUsersResponse = { count: number };
export type UnassignCardUserResponse = { message: string };

/**
 * ============================================================================
 * 📝 CHECKLIST MODULE TYPES
 * ============================================================================
 */

export interface Checklist {
  id: string;
  title: string;
  cardId: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  checklistId: string;
}

export interface GetCardChecklistsParams {
  boardId: string;
  cardId: string;
}

export interface CreateChecklistParams {
  boardId: string;
  cardId: string;
}

export interface CreateChecklistBody {
  name: string;
}

export interface UpdateChecklistParams {
  boardId: string;
  cardId: string;
  checklistId: string;
}

export interface UpdateChecklistBody {
  name: string;
}

export interface DeleteChecklistParams {
  boardId: string;
  cardId: string;
  checklistId: string;
}

export interface CreateChecklistItemParams {
  boardId: string;
  cardId: string;
  checklistId: string;
}

export interface CreateChecklistItemBody {
  name: string;
}

export interface UpdateChecklistItemParams {
  boardId: string;
  cardId: string;
  checklistId: string;
  itemId: string;
}

export interface UpdateChecklistItemBody {
  name?: string;
  isCompleted?: boolean;
}

export interface CompleteChecklistItemParams {
  boardId: string;
  cardId: string;
  checklistId: string;
  itemId: string;
}

export interface CompleteChecklistItemBody {
  isCompleted: boolean;
}

export interface DeleteChecklistItemParams {
  boardId: string;
  cardId: string;
  checklistId: string;
  itemId: string;
}

export type GetCardChecklistsResponse = (Checklist & { items: ChecklistItem[] })[];
export type CreateChecklistResponse = Checklist;
export type UpdateChecklistResponse = Checklist;
export type DeleteChecklistResponse = { message: string };
export type CreateChecklistItemResponse = ChecklistItem;
export type UpdateChecklistItemResponse = ChecklistItem;
export type CompleteChecklistItemResponse = ChecklistItem;
export type DeleteChecklistItemResponse = { message: string };

export type TodoStatus = "todo" | "doing" | "done";
export type ActivityType =
  | "BOARD_CREATED" | "BOARD_UPDATED" | "BOARD_DELETED"
  | "LIST_CREATED" | "LIST_UPDATED" | "LIST_DELETED" | "LIST_MOVED"
  | "CARD_CREATED" | "CARD_UPDATED" | "CARD_DELETED" | "CARD_MOVED" | "CARD_ASSIGNED"
  | "COMMENT_CREATED" | "COMMENT_UPDATED" | "COMMENT_DELETED"
  | "CHECKLIST_CREATED" | "CHECKLIST_UPDATED" | "CHECKLIST_ITEM_COMPLETED";

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
