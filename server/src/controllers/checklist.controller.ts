import type { Request, Response } from "express";
import ChecklistService from "../services/checklist.service.js";
import { responseHandler } from "../utils/responseHandler.js";
import { ActivityService } from "../services/activity.service.js";

export default class ChecklistController {
  static async getCardChecklists(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklists = await ChecklistService.getChecklists({ cardId });
    res.status(200).json(responseHandler.success(checklists));
  }

  static async createChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const { name } = req.body;
    const checklist = await ChecklistService.createChecklist({ cardId, name });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,

      userId: req.user.userId,
      cardId: cardId,
      action: "CHECKLIST_CREATED",
      description: `added checklist "${name}"`,
    });

    res.status(201).json(responseHandler.success(checklist));
  }

  static async updateChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const { name } = req.body;
    const checklist = await ChecklistService.updateChecklist({
      cardId,
      checklistId,
      name,
    });

    await ActivityService.logActivity({
      boardId: req.params.boardId as string,

      userId: req.user.userId,
      cardId: cardId,
      action: "CHECKLIST_UPDATED",
      description: `updated a checklist`,
    });

    res.status(200).json(responseHandler.success(checklist));
  }

  static async deleteChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const checklist = await ChecklistService.deleteChecklist({
      cardId,
      checklistId,
    });
    res.status(200).json(responseHandler.success(checklist));
  }

  static async createChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const { name } = req.body;
    const item = await ChecklistService.createChecklistItem({
      cardId,
      checklistId,
      name,
    });
    res.status(201).json(responseHandler.success(item));
  }

  static async updateChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const itemId = req.params.itemId as string;
    const { name, isCompleted } = req.body;
    const item = await ChecklistService.updateChecklistItem({
      cardId,
      checklistId,
      itemId,
      name,
      isCompleted,
    });
    res.status(200).json(responseHandler.success(item));
  }

  static async completeChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const itemId = req.params.itemId as string;
    const { isCompleted } = req.body;
    const item = await ChecklistService.completeChecklistItem({
      cardId,
      checklistId,
      itemId,
      isCompleted,
    });

    if (isCompleted) {
      await ActivityService.logActivity({
        boardId: req.params.boardId as string,

        userId: req.user.userId,
        cardId: cardId,
        action: "CHECKLIST_ITEM_COMPLETED",
        description: `completed checklist item`,
      });
    }

    res.status(200).json(responseHandler.success(item));
  }

  static async deleteChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const itemId = req.params.itemId as string;
    const item = await ChecklistService.deleteChecklistItem({
      cardId,
      checklistId,
      itemId,
    });
    res.status(200).json(responseHandler.success(item));
  }
}
