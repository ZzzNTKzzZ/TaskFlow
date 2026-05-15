import type { BoardVisibility } from "../../generated/prisma/index.js";

interface BaseItem {
  id: string;
  name: string;
}

interface BoardResponse extends BaseItem {
  background: string | null;
  visibility: BoardVisibility;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  lists?: any
}

interface CreateBoard {
  workspaceId: string;
  name: string;
  visibility: BoardVisibility;
  background: string | null;
  userId: string;
}

interface CreateBoardResponse extends BaseItem {
  workspaceId: string;
  name: string;
  visibility: BoardVisibility;
  background: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateBoard {
  boardId: string;
  name?: string;
  visibility?: BoardVisibility;
  background?: string;
  position?: number;
}
