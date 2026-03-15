import type { WorkspaceRole } from "../../../generated/prisma/index.js";
import slugify from "../../helper/slugify.helper.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/appError.js";

export class WorkspaceService {
  static async createWorkSpace(userId: string, name: string) {
    const slug = slugify(name);

    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug,
      },
    });

    await prisma.workspaceMember.create({
      data: {
        userId: userId,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    return workspace;
  }

  static async getUserWorkspaces(userId: string) {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    return workspaces;
  }

  static async getWorkspaceById(workspaceId: string, userId: string) {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
        members: {
          some: { userId },
        },
      },
    });

    if (!workspace) throw new AppError("Not found workspace with Id", 404);

    return workspace;
  }

  static async deleteWorkspace(workspaceId: string, userId: string) {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!member || member.role !== "OWNER") {
      throw new AppError("Only owner can delete workspace", 403);
    }

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return { message: "Workspace deleted successfully" };
  }

  static async addMember(workspaceId: string, userId: string, role: WorkspaceRole) { 
    const existing = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          workspaceId,
          userId
        }
      }
    })

    if(existing) throw new AppError("User already in workspace", 400)

    return prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId,
        role
      }
    })
  }

  static async getMembers(workspaceId: string) {
    return prisma.workspaceMember.findMany({
      where: {
        workspaceId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
  }

  static async editMember(workspaceId: string, userId: string, role: WorkspaceRole) {
    return prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      },
      data: {
        role
      }
    })
  }

  static async deleteMember(workspaceId: string, userId: string){
    return prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      }
    })
  }

    static async getBoards(workspaceId: string) {
    const boards = await prisma.board.findMany({
      where: {
        workspaceId,
      },
    });

    return boards;
  }
}
