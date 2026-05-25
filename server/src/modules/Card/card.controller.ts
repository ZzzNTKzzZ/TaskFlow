import type { Request, Response } from "express";
import CardService from "./card.service.js";
import { responseHandler } from "../../utils/responseHandler.js";

export default class CardController {
  // GET /cards/:cardId
  static async getCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const card = await CardService.getCard(cardId as string);
    res.status(200).json(responseHandler.success(card));
  }

  // PATCH /cards/:cardId
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async updateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const card = await CardService.updateCard(cardId as string, req.body);
    res.status(200).json(responseHandler.success(card));
  }

  // PATCH /cards/reorder
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async reorderCard(req: Request, res: Response) {
    const card = await CardService.reorderCard(req.body);
    res.status(200).json(responseHandler.success(card));
  }

  // DELETE /cards/:cardId
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async deleteCard(req: Request, res: Response) {
    const cardId = req.params.cardId;
    await CardService.deleteCard(cardId as string);
    res.status(200).json(responseHandler.success({ message: "Card deleted successfully" }));
  }

  // POST /cards/:cardId/assignees
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async assigneessUser(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const { userIds } = req.body;
    const assignees = await CardService.assignUsersToCard({ cardId, userIds });
    res.status(200).json(responseHandler.success(assignees));
  }

  // DELETE /cards/:cardId/assignees/:userId
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async unassignUser(req: Request, res: Response) {
    const { cardId, userId } = req.params as { cardId: string; userId: string };
    const unassignees = await CardService.unassignUserFromCard({ cardId, userId });
    res.status(200).json(responseHandler.success(unassignees));
  }
}
