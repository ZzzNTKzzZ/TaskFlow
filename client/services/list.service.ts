import {
  editListApi,
  deleteListApi,
  getListCardsApi,
  createCardInListApi,
} from "@/api/list.api";
import { CreateCardInListBody } from "@/types/types";

export default class ListService {
  static async editList(boardId: string, listId: string, payload: { name?: string; position?: number }) {
    const response = await editListApi(boardId, listId, payload);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async deleteList(boardId: string, listId: string) {
    const response = await deleteListApi(boardId, listId);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }

  static async getListCards(boardId: string, listId: string) {
    const response = await getListCardsApi(boardId, listId);
    if (!response || !response.success || !response.data) return [];
    return response.data;
  }

  static async createCardInList(boardId: string, listId: string, payload: CreateCardInListBody) {
    const response = await createCardInListApi(boardId, listId, payload);
    if (!response || !response.success || !response.data) return null;
    return response.data;
  }
}
