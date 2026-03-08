import slugify from "../helper/slugify.helper.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

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
}
