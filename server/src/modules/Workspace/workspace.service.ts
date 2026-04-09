import {
  WorkspaceRole,
  type BoardVisibility,
} from "../../../generated/prisma/index.js";
import slugify from "../../helper/slugify.helper.js";
import type { BoardResponse, CreateBoard, CreateBoardResponse } from "../../types/board.js";
import type {
  AddMember,
  CreateWorkspace,
  CreateWorkspaceResponse,
  MemberResponse,
  UpdateMember,
  UpdateWorkspace,
  UpdateWorkspaceResponse,
  WorkspaceDetailRespone,
  WorkspaceResponse,
} from "../../types/workspace.js";
import { AppError } from "../../utils/appError.js";
import BoardRepository from "../Board/board.repository.js";
import WorkspaceRepository from "./workspace.repository.js";

export class WorkspaceService {
  static async getUserWorkspaces({
    userId,
  }: {
    userId: string;
  }): Promise<WorkspaceResponse[]> {
    if (!userId) throw new AppError("Unauthorized", 401);

    const workspaces = await WorkspaceRepository.findUserWorkspaces({ userId });

    return workspaces.map((ws) => {
      const role = ws.members[0]!.role;

      if (!role) {
        throw new AppError("Invalid workspace role", 500);
      }

      const cardCount = ws.boards.reduce((total, board) => {
        return (
          total +
          board.lists.reduce((listTotal, list) => {
            return listTotal + list.cards.length;
          }, 0)
        );
      }, 0);

      return {
        id: ws.id,
        name: ws.name,
        slug: ws.slug,
        createdAt: ws.createdAt,

        stats: {
          memberCount: ws._count.members,
          boardCount: ws._count.boards,
          cardCount,
        },

        currentUser: {
          role,
        },
      };
    });
  }

  static async createWorkSpace({
    userId,
    name,
  }: CreateWorkspace): Promise<CreateWorkspaceResponse> {
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

    return { ...workspace, role: WorkspaceRole.OWNER };
  }

  static async getWorkspace({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }): Promise<WorkspaceDetailRespone> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({
      workspaceId,
      userId,
    });

    if (!workspace) throw new AppError("Workspace not found", 404);

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      createdAt: workspace.createdAt,

      currentUser: {
        role: workspace.members[0]!.role,
      },
    };
  }

  static async editWorkspace({
    workspaceId,
    userId,
    name,
  }: UpdateWorkspace): Promise<UpdateWorkspaceResponse> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!name) throw new AppError("Workspace name is required", 400);

    const existing = await WorkspaceRepository.findWorkspace({
      workspaceId,
      userId,
    });
    if (!existing) throw new AppError("Workspace not found", 404);

    const slug = slugify(name);

    const workspace = await WorkspaceRepository.updateWorkspace({
      workspaceId,
      name,
      slug,
    });
    return workspace;
  }

  static async deleteWorkspace({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({
      workspaceId,
      userId,
    });
    if (!workspace) throw new AppError("Workspace not found", 404);

    await WorkspaceRepository.deleteWorkspace({ workspaceId });

    return { message: "Workspace deleted" };
  }

  // ========================== MEMBER ==========================

  static async getMembers({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<MemberResponse[]> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const members = await WorkspaceRepository.findMembers({ workspaceId });
    return members.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
    }));
  }

  static async addMember({
    workspaceId,
    userId,
    role,
  }: AddMember): Promise<MemberResponse> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!userId) throw new AppError("User id is required", 400);
    if (!role) throw new AppError("Role is required", 400);

    const workspace = await WorkspaceRepository.findWorkspace({
      workspaceId,
      userId,
    });
    if (!workspace) throw new AppError("Workspace not found", 404);

    const existing = await WorkspaceRepository.findMember({
      workspaceId,
      userId,
    });

    if (existing) throw new AppError("User already a member", 409);

    const member = await WorkspaceRepository.addMember({
      workspaceId,
      userId,
      role,
    });
    return {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    };
  }

  static async editMember({
    workspaceId,
    userId,
    role,
  }: UpdateMember): Promise<MemberResponse> {
    if (!workspaceId || !userId || !role) {
      throw new AppError("Missing required fields", 400);
    }

    const existing = await WorkspaceRepository.findMember({
      workspaceId,
      userId,
    });

    if (!existing) throw new AppError("Member not found", 404);

    const member = await WorkspaceRepository.updateMember({
      workspaceId,
      userId,
      role,
    });
    return {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    };
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

  static async getBoards({ workspaceId }: { workspaceId: string }): Promise<BoardResponse[]> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    return await WorkspaceRepository.findBoards({ workspaceId });
    
  }

  static async createBoard({
    workspaceId,
    name,
    visibility,
    background,
    userId,
  }: CreateBoard): Promise<CreateBoardResponse> {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);
    if (!name) throw new AppError("Board name is required", 400);
    if (!userId) throw new AppError("Unauthorized", 401);

    const workspace = await WorkspaceRepository.findWorkspace({
      workspaceId,
      userId,
    });
    if (!workspace) throw new AppError("Workspace not found", 404);
    return await WorkspaceRepository.createBoard({
      workspaceId,
      name,
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
