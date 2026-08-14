import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { responseHandler } from "../utils/responseHandler.js";
import { AppError } from "../utils/appError.js";

export default class CommentController {
  // GET: /boards/:boardId/cards/:cardId/comments
  static async getComments(req: Request, res: Response) {
    const { cardId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { cardId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" }, // Newest first
    });

    res.status(200).json(responseHandler.success(comments));
  }

  // POST: /boards/:boardId/cards/:cardId/comments
  static async createComment(req: Request, res: Response) {
    const { cardId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!content) throw new AppError("Content is required", 400);

    const comment = await prisma.comment.create({
      data: {
        content,
        cardId,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(responseHandler.success(comment));
  }

  // PATCH: /boards/:boardId/cards/:cardId/comments/:commentId
  static async updateComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!content) throw new AppError("Content is required", 400);

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) throw new AppError("Comment not found", 404);
    if (existingComment.authorId !== userId) throw new AppError("Forbidden", 403);

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json(responseHandler.success(comment));
  }

  // DELETE: /boards/:boardId/cards/:cardId/comments/:commentId
  static async deleteComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) throw new AppError("Comment not found", 404);
    if (existingComment.authorId !== userId) throw new AppError("Forbidden", 403);

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(200).json(responseHandler.success({ message: "Comment deleted" }));
  }
}
