import type { Request, Response } from "express";
import ChecklistService from "./checklist.service.js";
import { responseHandler } from "../../utils/responseHandler.js";

export default class ChecklistController {
  static async getCardChecklists(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklists = await ChecklistService.getChecklists({ cardId });
    res.status(200).json(responseHandler.success(checklists));
  }

  static async createChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const { title } = req.body;
    const checklist = await ChecklistService.createChecklist({ cardId, title });
    res.status(201).json(responseHandler.success(checklist));
  }

  static async updateChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const { title } = req.body;
    const checklist = await ChecklistService.updateChecklist({
      cardId,
      checklistId,
      title,
    });
    res.status(200).json(responseHandler.success(checklist));
  }

  static async deleteChecklist(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const checklist = await ChecklistService.deleteChecklist({ cardId, checklistId });
    res.status(200).json(responseHandler.success(checklist));
  }

  static async createChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const { title } = req.body;
    const item = await ChecklistService.createChecklistItem({
      cardId,
      checklistId,
      title,
    });
    res.status(201).json(responseHandler.success(item));
  }

  static async updateChecklistItem(req: Request, res: Response) {
    const cardId = req.params.cardId as string;
    const checklistId = req.params.checklistId as string;
    const itemId = req.params.itemId as string;
    const { title, isCompleted } = req.body;
    const item = await ChecklistService.updateChecklistItem({
      cardId,
      checklistId,
      itemId,
      title,
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
