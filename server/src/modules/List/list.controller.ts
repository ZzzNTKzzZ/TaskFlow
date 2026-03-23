import type { Request, Response } from "express";
import ListServie from "./list.service.js";

export default class ListController {
  // GET  /boards/:boardId/lists
  static async getLists(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const lists = await ListServie.getLists(boardId);

    res.status(200).json(lists);
  }

  // POST /boards/:boardId/lists
  static async createList(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { title } = req.body;
    const list = await ListServie.createList(boardId, title);

    res.status(200).json(list);
  }

  // PATCH  /lists/:listId
  static async editList(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const { title, position } = req.body;

    const list = await ListServie.editList(listId, title, position);

    res.status(201).json(list);
  }

  // DELETE /lists/:listId
  static async deleteList(req: Request, res: Response) {
    const listId = req.params.listId as string;

    await ListServie.deleteList(listId);

    res.status(200).json({ message: "List deleted successfully" });
  }

  // PATCH /boards/:boardId/lists/reorder
  static async reorder(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const { listId, beforeId, afterId } = req.body;

    const list = await ListServie.reorder(boardId, {
      listId,
      beforeId,
      afterId,
    });
    return list
  }

}
