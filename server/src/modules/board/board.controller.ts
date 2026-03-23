import type { Request, Response } from "express";
import type {
  Prisma,
  BoardVisibility,
} from "../../../generated/prisma/index.js";
import BoardService from "./board.service.js";

export default class BoardController {
  // GET /boards/:boardId
  static async getBoard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    const board = await BoardService.getBoard(boardId);

    res.status(200).json(board);
  }

  // PATCH /boards/:boardId
  static async editBoard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    const { title, background, visibility, position } = req.body;

    const board = await BoardService.editBoard(
      boardId,
      title,
      visibility,
      background,
      position,
    );

    res.status(200).json(board);
  }

  // DELETE /boards/:boardId
  static async deleteBoard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    await BoardService.deleteBoard(boardId);

    res.status(200).json({ message: "Board deleted successfully" });
  }

  // GET /boards/:boardId/members
  static async getMembers(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    const members = await BoardService.getMembers(boardId);

    res.status(200).json(members);
  }
  // POST /boards/:boardId/members
  static async addMembers(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { memberIds } = req.body;

    const members = await BoardService.addMembers(boardId, memberIds);

    res.status(201).json(members);
  }

  // DELETE /boards/:boardId/members/:userId
  static async deleteMember(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const userId = req.params.userId as string;

    await BoardService.deleteMember(boardId, userId);

    res.status(200).json({ message: "Delete member" });
  }

  // PATCH /workspaces/:workspaceId/boards/reorder
  static async reorder(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;

    const { boardId, beforeId, afterId } = req.body;

    

    const board = await BoardService.reorderBoard(workspaceId, {
      boardId,
      beforeId,
      afterId,
    });

    res.status(200).json(board);
  }
}
