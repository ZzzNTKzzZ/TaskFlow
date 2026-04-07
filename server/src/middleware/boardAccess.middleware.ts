import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

export const boardAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { boardId } = req.params;
  if(!boardId) return next();
  const board = await prisma.board.findUnique({
    where: { id: boardId as string },
    select: { workspaceId: true },
  });

  if (!board) throw new AppError("Board not found", 404);

  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: req.user.userId,
        workspaceId: board.workspaceId,
      },
    },
  });
  if (!member) throw new AppError("Forbidden", 403);

  req.workspaceMember = member;

  next();
};
