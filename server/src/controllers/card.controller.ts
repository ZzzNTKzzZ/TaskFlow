import type { Request, Response } from "express";
import CardService from "../services/card.service.js";
import { responseHandler } from "../utils/responseHandler.js";
import { ActivityService } from "../services/activity.service.js";

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
    
    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      cardId: cardId as string,
      action: "CARD_UPDATED",
      description: `updated card '${card.name}'`,
    });

    res.status(200).json(responseHandler.success(card));
  }

  // PATCH /cards/reorder
  static async reorderCard(req: Request, res: Response) {
    const card = await CardService.reorderCard(req.body);

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      action: "CARD_MOVED",
      description: `moved card '${card.name}' to a new position`,
    });

    res.status(200).json(responseHandler.success(card));
  }

  // DELETE /cards/:cardId
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async deleteCard(req: Request, res: Response) {
    const cardId = req.params.cardId;
    
    // Fetch card name before deleting
    const cardToDel = await CardService.getCard(cardId as string).catch(() => null);
    const cardName = cardToDel ? cardToDel.name : "a card";

    await CardService.deleteCard(cardId as string);

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      action: "CARD_DELETED",
      description: `deleted card '${cardName}'`,
    });

    res.status(200).json(responseHandler.success({ message: "Card deleted successfully" }));
  }

  // POST /cards/:cardId/assignees
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async assigneessUser(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const { userIds } = req.body;
    const assignees = await CardService.assignUsersToCard({ cardId, userIds });

    // Fetch details to make the activity log informative
    const [card, users] = await Promise.all([
      CardService.getCard(cardId),
      import("../lib/prisma.js").then((m) => m.prisma.user.findMany({ where: { id: { in: userIds } }, select: { name: true } }))
    ]);
    const userNames = users.map(u => u.name).join(", ");

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      cardId: cardId as string,
      action: "CARD_ASSIGNED",
      description: `assigned ${userNames} to card '${card.name}'`,
    });

    res.status(200).json(responseHandler.success(assignees));
  }

  // DELETE /cards/:cardId/assignees/:userId
  // STANDARDIZED: Response JSON wrapped inside responseHandler.success envelope
  static async unassignUser(req: Request, res: Response) {
    const { cardId, userId } = req.params as { cardId: string; userId: string };
    
    // Fetch details before unassigning
    const [card, user] = await Promise.all([
      CardService.getCard(cardId).catch(() => null),
      import("../lib/prisma.js").then((m) => m.prisma.user.findUnique({ where: { id: userId }, select: { name: true } }))
    ]);
    const cardName = card ? card.name : "a card";
    const userName = user ? user.name : "a user";

    const unassignees = await CardService.unassignUserFromCard({ cardId, userId });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,
      userId: req.user.userId,
      cardId: cardId as string,
      action: "CARD_ASSIGNED", // Or CARD_UNASSIGNED if it exists in enum, but let's stick to existing
      description: `unassigned ${userName} from card '${cardName}'`,
    });

    res.status(200).json(responseHandler.success(unassignees));
  }
}
