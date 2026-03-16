import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/appError.js";

export const workspaceAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    const workspaceId = req.params.workspaceId as string
    const userId = req.user.id

    const member = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId,
                workspaceId
            }
        }
    })

    if(!member) throw new AppError("Access denied", 403)

    req.workspaceMember = member

    next()
};
