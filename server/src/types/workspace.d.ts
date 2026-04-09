import type { WorkspaceRole } from "../../generated/prisma/index.js";

interface BaseItem {
  id: string;
  name: string;
}
interface WorkspaceResponse extends BaseItem {
  slug: string;
  createdAt: Date;

  stats: {
    memberCount: number;
    boardCount: number;
    cardCount: number;
  };

  currentUser: {
    role: WorkspaceRole;
  };
}
interface CreateWorkspace {
  userId: string;
  name: string;
}

interface CreateWorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  role: WorkspaceRole;
}

interface WorkspaceDetailRespone extends BaseItem {
  slug: string;
  createdAt: Date;

  currentUser: {
    role: WorkspaceRole;
  };
}

interface UpdateWorkspace {
  workspaceId: string;
  userId: string;
  name: string;
}

interface UpdateWorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

// ========================== MEMBER ==========================

interface MemberResponse extends BaseItem {
  name: string | null;
  email: string;
  role: WorkspaceRole;
}

interface AddMember {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
}

interface UpdateMember {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
}
