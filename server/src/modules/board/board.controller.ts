import type { Request, Response } from "express";
import BoardService from "./board.service.js";
import { responseHandler } from "../../utils/responseHandler.js";
import { ActivityService } from "../Activity/activity.service.js";

export default class BoardController {
  // GET /boards/:boardId
  static async getBoard(req: Request, res: Response) {
    const { boardId } = req.params;
    const board = await BoardService.getBoard({ boardId: boardId as string });
    res.status(200).json(responseHandler.success(board));
  }

  // PATCH /boards/:boardId
  static async editBoard(req: Request, res: Response) {
    const { boardId } = req.params;
    const { name, background, visibility, position } = req.body;

    const board = await BoardService.editBoard({
      boardId: boardId as string,
      name,
      visibility,
      background,
      position,
    });

    await ActivityService.logActivity({
      boardId: boardId as string,
      userId: req.user.userId,
      action: "BOARD_UPDATED",
      description: `updated board`,
    });

    res.status(200).json(responseHandler.success(board));
  }

  // DELETE /boards/:boardId
  static async deleteBoard(req: Request, res: Response) {
    const { boardId } = req.params;

    await BoardService.deleteBoard({
      boardId: boardId as string,
    });

    await ActivityService.logActivity({
      boardId: boardId as string,
      userId: req.user.userId,
      action: "BOARD_DELETED",
      description: `deleted board`,
    });

    res.status(200).json(responseHandler.success(boardId));
  }

  // ========================== MEMBERS ==========================

  // GET /boards/:boardId/members
  static async getMembers(req: Request, res: Response) {
    const { boardId } = req.params;

    const members = await BoardService.getMembers({
      boardId: boardId as string,
    });

    res.status(200).json(responseHandler.success(members));
  }

  // POST /boards/:boardId/members
  static async addMembers(req: Request, res: Response) {
    const { boardId } = req.params;
    const { memberIds } = req.body;

    const result = await BoardService.addMembers({
      boardId: boardId as string,
      memberIds,
    });

    await ActivityService.logActivity({
      boardId: boardId as string,
      userId: req.user.userId,
      action: "BOARD_UPDATED",
      description: `added members to board`,
    });

    res.status(201).json(responseHandler.success(result));
  }

  // DELETE /boards/:boardId/members/:userId
  static async deleteMember(req: Request, res: Response) {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };

    const result = await BoardService.deleteMember({ boardId, userId });

    await ActivityService.logActivity({
      boardId: boardId as string,
      userId: req.user.userId,
      action: "BOARD_UPDATED",
      description: `removed a member from the board`,
    });

    res.status(200).json(responseHandler.success(result));
  }

  // ========================== LIST ==========================

  // GET /boards/:boardId/lists
  static async getLists(req: Request, res: Response) {
    const { boardId } = req.params;

    const lists = await BoardService.getLists({ boardId: boardId as string });

    res.status(200).json(responseHandler.success(lists));
  }
  // POST /boards/:boardId/lists
  static async createList(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { name } = req.body;
    const list = await BoardService.createList({ boardId, name });
    
    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      listId: list.id,
      action: "LIST_CREATED",
      description: `created list "${name}"`,
    });

    res.status(201).json(responseHandler.success(list));
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

    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      listId,
      action: "LIST_MOVED",
      description: `moved a list`,
    });

    res.status(200).json(responseHandler.success(list));
  }
}
