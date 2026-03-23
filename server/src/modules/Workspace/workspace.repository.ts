import type {
  BoardVisibility,
  WorkspaceRole,
} from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class WorkspaceRepository {
  static async findUserWorkspaces(userId: string) {
    return await prisma.workspace.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          where: { userId },
          select: { role: true, },
        },
        
        _count: {
          select: { members: true },
        },
      },
      orderBy: {
        createdAt: "asc"
      }
    });
  }

  static async createWorkspace(userId: string, name: string, slug: string) {
    return await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: { name, slug },
      });

      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: "OWNER",
        },
      });
      return workspace;
    });
  }

  static async findWorkspace(workspaceId: string) {
    return await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
  }

  static async updateWorkspace(
    workspaceId: string,
    name: string,
    slug: string,
  ) {
    return await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        slug,
      },
    });
  }

  static async deleteWorkspace(workspaceId: string) {
    return await prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }

  static async findWorkspaceBySlug(slug: string) {
    return await prisma.workspace.findUnique({
      where: { slug },
    });
  }

  // ========================== WORKSPACE MEMBER ==========================
  static async findMembers(workspaceId: string) {
    return await prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: {
        id: true,
        userId: true,
        role: true,
      },
      orderBy: {
        user: {
          name: "asc"
        }
      }
    });
  }

  static async findMember(workspaceId: string, userId: string) {
    return await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  static async addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ) {
    return await prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role: role || "MEMBER",
      },
      select: {
        id: true,
        userId: true,
        role: true,
      },
    });
  }

  static async updateMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ) {
    return await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
    });
  }

  static async deleteMember(workspaceId: string, userId: string) {
    return await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  // ========================== BOARD ==========================
  static async findBoards(workspaceId: string) {
    return await prisma.board.findMany({
      where: { workspaceId },
    });
  }

  static async createBoard(
    workspaceId: string,
    title: string,
    visibility: BoardVisibility,
    background: string,
    userId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          workspaceId,
          title,
          visibility,
          background,
          position: 0,
        },
      });

      await tx.boardMember.create({
        data: {
          userId,
          boardId: board.id,
        },
      });

      return board;
    });
  }
}
