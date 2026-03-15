import type { Request, Response } from "express";
import type { Prisma, BoardVisibility } from "../../../generated/prisma/index.js";
import BoardService from "./board.service.js";

interface CreateBoardBody {
  title: string;
  visibility: BoardVisibility;
  position?: number;
}

export default class BoardController {
  // POST /boards
  static async createBoard(req: Request, res: Response) {
    const userId = req.user.id;
    const workspaceId = req.body.workspaceId;

    const { title, visibility, position } = req.body as CreateBoardBody;

    const payload: Prisma.BoardUncheckedCreateInput = {
      title,
      visibility,
      workspaceId,
      position: position ?? 0,
    };

    const board = await BoardService.createBoard(userId, payload);

    res.status(201).json(board);
  }

  // GET /boards/:boardId
  static async getBoard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    const board = await BoardService.getBoard(boardId);

    res.status(200).json(board);
  }

  // PATCH /boards/:boardId
  static async editBoard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;

    const { title, background } = req.body;

    const board = await BoardService.editBoard(boardId, title, background);

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
    const boardId = req.params.boardId as string
    const { memberIds }= req.body

    const members = await BoardService.addMembers(boardId, memberIds)

    res.status(201).json(members)
  }

  // DELETE /boards/:boardId/members/:userId
  static async deleteMember(req: Request, res: Response) {
    const boardId = req.params.boardId as string
    const { memberId } = req.body
    
    await BoardService.deleteMember(boardId, memberId)

    res.status(200).json({ message : "Delete member"})
  }

  // PATCH /boards/reorder
  static async reorder(req: Request, res: Response) {
    const { boardId, prev, next } =  req.body

    const reorder = await BoardService.reorderBoard(boardId, prev, next)

    res.status(200).json(reorder)
  }
}
