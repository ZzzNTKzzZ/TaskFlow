import {
  getCardChecklistsApi,
  createChecklistApi,
  updateChecklistApi,
  deleteChecklistApi,
  createChecklistItemApi,
  updateChecklistItemApi,
  completeChecklistItemApi,
  deleteChecklistItemApi,
} from "./checklist.api";
import { UpdateChecklistItemBody } from "@/types/types";

export default class ChecklistService {
  static async getCardChecklists(boardId: string, cardId: string) {
    const response = await getCardChecklistsApi(boardId, cardId);
    if (!response || !response.success || !response.data) return [];
    return response.data;
  }

  static async createChecklist(boardId: string, cardId: string, name: string) {
    const response = await createChecklistApi(boardId, cardId, name);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async updateChecklist(boardId: string, cardId: string, checklistId: string, name: string) {
    const response = await updateChecklistApi(boardId, cardId, checklistId, name);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async deleteChecklist(boardId: string, cardId: string, checklistId: string) {
    const response = await deleteChecklistApi(boardId, cardId, checklistId);
    return response;
  }

  static async createChecklistItem(boardId: string, cardId: string, checklistId: string, name: string) {
    const response = await createChecklistItemApi(boardId, cardId, checklistId, name);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async updateChecklistItem(boardId: string, cardId: string, checklistId: string, itemId: string, payload: UpdateChecklistItemBody) {
    const response = await updateChecklistItemApi(boardId, cardId, checklistId, itemId, payload);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async completeChecklistItem(boardId: string, cardId: string, checklistId: string, itemId: string, isCompleted: boolean) {
    const response = await completeChecklistItemApi(boardId, cardId, checklistId, itemId, isCompleted);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async deleteChecklistItem(boardId: string, cardId: string, checklistId: string, itemId: string) {
    const response = await deleteChecklistItemApi(boardId, cardId, checklistId, itemId);
    return response;
  }
}
