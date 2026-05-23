import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import ChecklistRepository from "./checklist.repository.js";
import CardRepository from "../Card/card.repository.js";

export default class ChecklistService {
  static async getChecklists({ cardId }: { cardId: string }) {
    return ChecklistRepository.findChecklists({ cardId });
  }

  static async createChecklist({
    cardId,
    name,
  }: {
    cardId: string;
    name: string;
  }) {
    const card = await CardRepository.findCard({ cardId });
    if (!card) throw new AppError("Card not found", 404);

    return ChecklistRepository.createChecklist({
      data: {
        name,
        cardId,
      },
    });
  }

  static async updateChecklist({
    cardId,
    checklistId,
    name,
  }: {
    cardId: string;
    checklistId: string;
    name?: string;
  }) {
    const checklist = await ChecklistRepository.findChecklist({ checklistId });
    if (!checklist) throw new AppError("Checklist not found", 404);
    if (checklist.cardId !== cardId) {
      throw new AppError("Checklist does not belong to this card", 400);
    }

    const data = removeUndefined({ name });
    if (!Object.keys(data).length) {
      throw new AppError("No fields provided for update", 400);
    }

    return ChecklistRepository.updateChecklist({ checklistId, data });
  }

  static async deleteChecklist({
    cardId,
    checklistId,
  }: {
    cardId: string;
    checklistId: string;
  }) {
    const checklist = await ChecklistRepository.findChecklist({ checklistId });
    if (!checklist) throw new AppError("Checklist not found", 404);
    if (checklist.cardId !== cardId) {
      throw new AppError("Checklist does not belong to this card", 400);
    }

    return ChecklistRepository.deleteChecklist({ checklistId });
  }

  static async createChecklistItem({
    cardId,
    checklistId,
    name,
  }: {
    cardId: string;
    checklistId: string;
    name: string;
  }) {
    const checklist = await ChecklistRepository.findChecklist({ checklistId });
    if (!checklist) throw new AppError("Checklist not found", 404);
    if (checklist.cardId !== cardId) {
      throw new AppError("Checklist does not belong to this card", 400);
    }

    return ChecklistRepository.createChecklistItem({
      data: { name, checklistId },
    });
  }

  static async updateChecklistItem({
    cardId,
    checklistId,
    itemId,
    name,
    isCompleted,
  }: {
    cardId: string;
    checklistId: string;
    itemId: string;
    name?: string;
    isCompleted?: boolean;
  }) {
    const item = await ChecklistRepository.findChecklistItem({ itemId });
    if (!item) throw new AppError("Checklist item not found", 404);
    if (item.checklistId !== checklistId) {
      throw new AppError("Checklist item does not belong to this checklist", 400);
    }

    const data = removeUndefined({ name, isCompleted });
    if (!Object.keys(data).length) {
      throw new AppError("No fields provided for update", 400);
    }

    return ChecklistRepository.updateChecklistItem({ itemId, data });
  }

  static async deleteChecklistItem({
    cardId,
    checklistId,
    itemId,
  }: {
    cardId: string;
    checklistId: string;
    itemId: string;
  }) {
    const item = await ChecklistRepository.findChecklistItem({ itemId });
    if (!item) throw new AppError("Checklist item not found", 404);
    if (item.checklistId !== checklistId) {
      throw new AppError("Checklist item does not belong to this checklist", 400);
    }

    return ChecklistRepository.deleteChecklistItem({ itemId });
  }

  static async completeChecklistItem({
    cardId,
    checklistId,
    itemId,
    isCompleted,
  }: {
    cardId: string;
    checklistId: string;
    itemId: string;
    isCompleted: boolean;
  }) {
    const item = await ChecklistRepository.findChecklistItem({ itemId });
    if (!item) throw new AppError("Checklist item not found", 404);
    if (item.checklistId !== checklistId) {
      throw new AppError("Checklist item does not belong to this checklist", 400);
    }

    return ChecklistRepository.updateChecklistItem({
      itemId,
      data: { isCompleted },
    });
  }
}
