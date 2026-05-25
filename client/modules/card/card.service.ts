import {
  getCardApi,
  updateCardApi,
  reorderCardApi,
  deleteCardApi,
  assignUsersToCardApi,
  unassignUserFromCardApi,
} from "./card.api";
import { UpdateCardBody, ReorderCardBody } from "@/types/types";

export default class CardService {
  static async getCard(boardId: string, cardId: string) {
    const response = await getCardApi(boardId, cardId);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async updateCard(boardId: string, cardId: string, payload: UpdateCardBody) {
    const response = await updateCardApi(boardId, cardId, payload);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async reorderCard(boardId: string, payload: ReorderCardBody) {
    const response = await reorderCardApi(boardId, payload);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async deleteCard(boardId: string, cardId: string) {
    const response = await deleteCardApi(boardId, cardId);
    return response;
  }

  static async assignUsersToCard(boardId: string, cardId: string, userIds: string[]) {
    const response = await assignUsersToCardApi(boardId, cardId, userIds);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }

  static async unassignUserFromCard(boardId: string, cardId: string, userId: string) {
    const response = await unassignUserFromCardApi(boardId, cardId, userId);
    return response;
  }
}
