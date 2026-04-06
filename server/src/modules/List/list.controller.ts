import type { Request, Response } from "express";
import ListService from "./list.service.js";

export default class ListController {
  // PATCH  /lists/:listId
  static async editList(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const { title, position } = req.body;

    const list = await ListService.editList({ listId, title, position });

    res.status(200).json(list);
  }

  // DELETE /lists/:listId
  static async deleteList(req: Request, res: Response) {
    const listId = req.params.listId as string;

    await ListService.deleteList({ listId });

    res.status(200).json({ message: "List deleted successfully" });
  }

  // GET /lists/:listId/cards
  static async getCards(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const cards = await ListService.getCards({ listId });
    res.status(200).json(cards);
  }

  // POST /lists/:listId/cards
  static async createCard(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const card = await ListService.createCard({ ...req.body, listId });
    res.status(201).json(card);
  }
}
