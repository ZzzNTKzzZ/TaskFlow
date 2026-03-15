import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

export const workspaceRoleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) throw new AppError("User not authenticated", 401);

    const workspaceId = req.body.workspaceId as string;

    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!member) throw new AppError("User is not a member of this workspace", 403);

    req.workspaceRole = member.role;

    next();
  } catch (error) {
    next(error);
  }
};