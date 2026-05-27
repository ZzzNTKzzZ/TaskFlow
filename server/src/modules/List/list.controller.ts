import type { Request, Response } from "express";
import ListService from "./list.service.js";
import { responseHandler } from "../../utils/responseHandler.js";
import { ActivityService } from "../Activity/activity.service.js";

export default class ListController {
  // PATCH  /lists/:listId
  static async editList(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const { name, position } = req.body;

    const list = await ListService.editList({ listId, name, position });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,

      userId: req.user.userId,
      listId: listId as string,
      action: "LIST_UPDATED",
      description: `updated a list`,
    });

    res.status(200).json(responseHandler.success(list));
  }

  // DELETE /lists/:listId
  static async deleteList(req: Request, res: Response) {
    const listId = req.params.listId as string;

    const list = await ListService.deleteList({ listId });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      action: "LIST_DELETED",
      description: `deleted a list`,
    });

    res.status(200).json(responseHandler.success(list));
  }

  // GET /lists/:listId/cards
  static async getCards(req: Request, res: Response) {
    const listId = req.params.listId as string;
    console.log(listId);
    const cards = await ListService.getCards({ listId });
    res.status(200).json(responseHandler.success(cards));
  }

  // POST /lists/:listId/cards
  static async createCard(req: Request, res: Response) {
    const listId = req.params.listId as string;
    const card = await ListService.createCard({ ...req.body, listId });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      listId: listId as string,
      cardId: card.id,
      action: "CARD_CREATED",
      description: `created card "${card.name}"`,
    });

    res.status(201).json(responseHandler.success(card));
  }
}
