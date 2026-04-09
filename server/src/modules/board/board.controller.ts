import type { Request, Response } from "express";
import BoardService from "./board.service.js";

export default class BoardController {
  // GET /boards/:boardId
  static async getBoard(req: Request, res: Response) {
    const { boardId } = req.params;
    const board = await BoardService.getBoard({ boardId: boardId as string });
    res.status(200).json(board);
  }

  // PATCH /boards/:boardId
  static async editBoard(req: Request, res: Response) {
    const { boardId } = req.params;
    const { title, background, visibility, position } = req.body;

    const board = await BoardService.editBoard({
      boardId: boardId as string,
      title,
      visibility,
      background,
      position,
    });

    res.status(200).json(board);
  }

  // DELETE /boards/:boardId
  static async deleteBoard(req: Request, res: Response) {
    const { boardId } = req.params;

    await BoardService.deleteBoard({
      boardId: boardId as string,
    });

    res
      .status(200)
      .json({ success: true, message: "Board deleted successfully" });
  }

  // ========================== MEMBERS ==========================

  // GET /boards/:boardId/members
  static async getMembers(req: Request, res: Response) {
    const { boardId } = req.params;

    const members = await BoardService.getMembers({
      boardId: boardId as string,
    });

    res.status(200).json(members);
  }

  // POST /boards/:boardId/members
  static async addMembers(req: Request, res: Response) {
    const { boardId } = req.params;
    const { memberIds } = req.body;

    const result = await BoardService.addMembers({
      boardId: boardId as string,
      memberIds,
    });

    res.status(201).json(result);
  }

  // DELETE /boards/:boardId/members/:userId
  static async deleteMember(req: Request, res: Response) {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const result = await BoardService.deleteMember({ boardId, userId });

    res.status(200).json(result);
  }

  // ========================== LIST ==========================

  // GET /boards/:boardId/lists
  static async getLists(req: Request, res: Response) {
    const { boardId } = req.params;

    const lists = await BoardService.getLists({ boardId: boardId as string });

    res.status(200).json(lists);
  }
  // POST /boards/:boardId/lists
  static async createList(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { title } = req.body;
    console.log("Đang tạo List:", title);
    const list = await BoardService.createList({ boardId, title });

    res.status(201).json(list);
  }

  // PATCH /boards/:boardId/lists/reorder
  static async reorderList(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { listId, beforeId, afterId } = req.body;

    const list = await BoardService.reorderList({
      boardId,
      listId,
      beforeId,
      afterId,
    });

    res.status(200).json(list);
  }
}
