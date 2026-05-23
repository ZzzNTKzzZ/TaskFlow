import {
  getCardChecklists,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  createChecklistItem,
  updateChecklistItem,
  completeChecklistItem,
  deleteChecklistItem,
} from "./checklist.api";

export default class ChecklistService {
  static async getCardChecklists(cardId: string) {
    const response = await getCardChecklists(cardId);
    if (!response || !response.success || !response.data) return [];
    return response.data;
  }

  static async createChecklist(boardId: string ,cardId: string, name: string) {
    const response = await createChecklist(boardId ,cardId, name);
    return response;
  }

  static async updateChecklist(cardId: string, checklistId: string, payload: any) {
    const response = await updateChecklist(cardId, checklistId, payload);
    return response;
  }

  static async deleteChecklist(cardId: string, checklistId: string) {
    const response = await deleteChecklist(cardId, checklistId);
    return response;
  }

  static async createChecklistItem(boardId: string ,cardId: string, checklistId: string, payload: any) {
    const response = await createChecklistItem(boardId ,cardId, checklistId, payload);
    return response;
  }

  static async updateChecklistItem(cardId: string, checklistId: string, itemId: string, payload: any) {
    const response = await updateChecklistItem(cardId, checklistId, itemId, payload);
    return response;
  }

  static async completeChecklistItem(cardId: string, checklistId: string, itemId: string, payload: any) {
    const response = await completeChecklistItem(cardId, checklistId, itemId, payload);
    return response;
  }

  static async deleteChecklistItem(cardId: string, checklistId: string, itemId: string) {
    const response = await deleteChecklistItem(cardId, checklistId, itemId);
    return response;
  }
}
