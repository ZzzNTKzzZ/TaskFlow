import type {
  BoardVisibility,
  WorkspaceRole,
} from "../../../generated/prisma/index.js";
import slugify from "../../helper/slugify.helper.js";
import { AppError } from "../../utils/appError.js";
import BoardRepository from "../Board/board.repository.js";
import WorkspaceRepository from "./workspace.repository.js";

export class WorkspaceService {
  static async getUserWorkspaces({ userId }: { userId: string }) {
    if (!userId) throw new AppError("Unauthorized", 401);

    const workspaces = await WorkspaceRepository.findUserWorkspaces({ userId });

    return workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      createdAt: ws.createdAt,
      role: ws.members[0]?.role,
      memberCount: ws._count.members,
    }));
  }

  static async createWorkSpace({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }) {
    if (!userId) throw new AppError("Unauthorized", 401);
    if (!name) throw new AppError("Workspace name is required", 400);

    const baseSlug = slugify(name);
    const shortId = userId.slice(-8);
    const slug = `${baseSlug}-${shortId}`;

    const workspace = await WorkspaceRepository.createWorkspace({
      userId,
      name,
      slug,
    });

    if (!workspace) throw new AppError("Failed to create workspace", 500);

    return workspace;
  }

  static async getWorkspace({ workspaceId }: { workspaceId: string }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({ workspaceId });

    if (!workspace) throw new AppError("Workspace not found", 404);

    return workspace;
  }

  static async editWorkspace({
    workspaceId,
    name,
  }: {
    workspaceId: string;
    name: string;
  }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!name) throw new AppError("Workspace name is required", 400);

    const existing = await WorkspaceRepository.findWorkspace({ workspaceId });
    if (!existing) throw new AppError("Workspace not found", 404);

    const slug = slugify(name);

    const workspace = await WorkspaceRepository.updateWorkspace({
      workspaceId,
      name,
      slug,
    });

    return workspace;
  }

  static async deleteWorkspace({ workspaceId }: { workspaceId: string }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({ workspaceId });
    if (!workspace) throw new AppError("Workspace not found", 404);

    await WorkspaceRepository.deleteWorkspace({ workspaceId });

    return { message: "Workspace deleted" };
  }

  // ========================== MEMBER ==========================

  static async getMembers({ workspaceId }: { workspaceId: string }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const members = await WorkspaceRepository.findMembers({ workspaceId });

    return { members };
  }

  static async addMember({
    workspaceId,
    userId,
    role,
  }: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!userId) throw new AppError("User id is required", 400);
    if (!role) throw new AppError("Role is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({ workspaceId });
    if (!workspace) throw new AppError("Workspace not found", 404);

    const existing = await WorkspaceRepository.findMember({
      workspaceId,
      userId,
    });

    if (existing) throw new AppError("User already a member", 409);

    return WorkspaceRepository.addMember({
      workspaceId,
      userId,
      role,
    });
  }

  static async editMember({
    workspaceId,
    userId,
    role,
  }: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }) {
    if (!workspaceId || !userId || !role) {
      throw new AppError("Missing required fields", 400);
    }

    const existing = await WorkspaceRepository.findMember({
      workspaceId,
      userId,
    });

    if (!existing) throw new AppError("Member not found", 404);

    return WorkspaceRepository.updateMember({
      workspaceId,
      userId,
      role,
    });
  }

  static async deleteMember({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    if (!workspaceId || !userId) {
      throw new AppError("Missing required fields", 400);
    }

    const existing = await WorkspaceRepository.findMember({
      workspaceId,
      userId,
    });

    if (!existing) throw new AppError("Member not found", 404);

    await WorkspaceRepository.deleteMember({ workspaceId, userId });

    return { message: "Member removed" };
  }

  // ========================== BOARD ==========================

  static async getBoards({ workspaceId }: { workspaceId: string }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    return WorkspaceRepository.findBoards({ workspaceId });
  }

  static async createBoard({
    workspaceId,
    title,
    visibility,
    background,
    userId,
  }: {
    workspaceId: string;
    title: string;
    visibility: BoardVisibility;
    background: string;
    userId: string;
  }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!title) throw new AppError("Board title is required", 400);
    if (!userId) throw new AppError("Unauthorized", 401);

    const workspace = await WorkspaceRepository.findWorkspace({ workspaceId });
    if (!workspace) throw new AppError("Workspace not found", 404);

    return WorkspaceRepository.createBoard({
      workspaceId,
      title,
      visibility,
      background,
      userId,
    });
  }
  static async reorderBoard({
    workspaceId,
    boardId,
    beforeId,
    afterId,
  }: {
    workspaceId: string;
    boardId: string;
    beforeId?: string | null;
    afterId?: string | null;
  }) {
    if (!workspaceId || !boardId) {
      throw new AppError("Workspace id and board id are required", 400);
    }
    const existing = await BoardRepository.findBoard({ boardId });
    if (!existing) throw new AppError("Board not found", 404);

    const [before, after] = await Promise.all([
      beforeId ? BoardRepository.findBoard({ boardId: beforeId }) : null,
      afterId ? BoardRepository.findBoard({ boardId: afterId }) : null,
    ]);

    let newPosition: number;
    if (before && after) {
      newPosition = (before.position + after.position) / 2;
    } else if (before && !after) {
      newPosition = before.position + 1;
    } else if (!before && after) {
      newPosition = after.position - 1;
    } else {
      newPosition = 1;
    }

    return BoardRepository.reorder({
      boardId,
      position: newPosition,
    });
  }
}