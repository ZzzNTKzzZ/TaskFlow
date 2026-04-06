import type { Request, Response } from "express";
import CardService from "./card.service.js";

export default class CardController {

  // PATCH /cards/:cardId
  static async updateCard(req: Request, res: Response) {
    const cardId = req.params.cardId;
    const card = await CardService.updateCard(cardId as string, req.body);
    res.status(200).json(card);
  }

  // PATCH /cards/reorder
  static async reorderCard(req: Request, res: Response) {
    const card = await CardService.reorderCard(req.body);
    res.status(200).json(card);
  }

  // DELETE /cards/:cardId
  static async deleteCard(req: Request, res: Response) {
    const cardId = req.params.cardId;
    await CardService.deleteCard(cardId as string);
    res.status(200).json({ message: "Card deleted successfully" });
  }
}
