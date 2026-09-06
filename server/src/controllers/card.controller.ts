import type { Request, Response } from "express";
import CardService from "../services/card.service.js";
import { responseHandler } from "../utils/responseHandler.js";
import { ActivityService } from "../services/activity.service.js";
import { prisma } from "../lib/prisma.js";
import { broadcastToBoard } from "../lib/socket.js";

export default class CardController {
  // GET /cards/:cardId
  static async getCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const card = await CardService.getCard(cardId as string);
    res.status(200).json(responseHandler.success(card));
  }

  // PATCH /cards/:cardId
  static async updateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const boardId = req.params.boardId as string;
    const card = await CardService.updateCard(cardId as string, req.body);
    
    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      cardId: cardId as string,
      action: "CARD_UPDATED",
      description: `updated card '${card.name}'`,
    });

    broadcastToBoard(boardId, "card:updated", { cardId, payload: card });

    res.status(200).json(responseHandler.success(card));
  }

  // PATCH /cards/reorder
  static async reorderCard(req: Request, res: Response) {
    const boardId = req.params.boardId as string;
    const card = await CardService.reorderCard(req.body);

    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      action: "CARD_MOVED",
      description: `moved card '${card.name}' to a new position`,
    });

    broadcastToBoard(boardId, "card:updated", { cardId: card.id, payload: card });

    res.status(200).json(responseHandler.success(card));
  }

  // DELETE /cards/:cardId
  static async deleteCard(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const boardId = req.params.boardId as string;
    
    // Fetch card name before deleting
    const cardToDel = await CardService.getCard(cardId).catch(() => null);
    const cardName = cardToDel ? cardToDel.name : "a card";

    await CardService.deleteCard(cardId);

    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      action: "CARD_DELETED",
      description: `deleted card '${cardName}'`,
    });

    broadcastToBoard(boardId, "card:deleted", cardId);

    res.status(200).json(responseHandler.success({ message: "Card deleted successfully" }));
  }

  // POST /cards/:cardId/assignees
  static async assigneessUser(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const boardId = req.params.boardId as string;
    const { userIds } = req.body;
    const assignees = await CardService.assignUsersToCard({ cardId, userIds });

    // Fetch details to make the activity log informative
    const [card, users] = await Promise.all([
      CardService.getCard(cardId),
      prisma.user.findMany({ where: { id: { in: userIds } }, select: { name: true } })
    ]);
    const userNames = users.map(u => u.name).filter(Boolean).join(", ");

    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      cardId,
      action: "CARD_ASSIGNED",
      description: `assigned ${userNames || "members"} to card '${card.name}'`,
    });

    broadcastToBoard(boardId, "card:updated", { cardId, payload: { assignees } });

    res.status(200).json(responseHandler.success(assignees));
  }

  // DELETE /cards/:cardId/assignees/:userId
  static async unassignUser(req: Request, res: Response) {
    const { cardId, userId } = req.params as { cardId: string; userId: string };
    const boardId = req.params.boardId as string;
    
    // Fetch details before unassigning
    const [card, user] = await Promise.all([
      CardService.getCard(cardId).catch(() => null),
      prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
    ]);
    const cardName = card ? card.name : "a card";
    const userName = user?.name || "a user";

    const unassignees = await CardService.unassignUserFromCard({ cardId, userId });

    await ActivityService.logActivity({
      boardId,
      userId: req.user.userId,
      cardId,
      action: "CARD_ASSIGNED",
      description: `unassigned ${userName} from card '${cardName}'`,
    });

    broadcastToBoard(boardId, "card:updated", { cardId, payload: { assignees: unassignees } });

    res.status(200).json(responseHandler.success(unassignees));
  }
}
