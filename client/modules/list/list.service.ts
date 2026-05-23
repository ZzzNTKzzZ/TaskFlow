import { Priority } from "@/types/type";
import { editList, deleteList, getListCards, createCardInList } from "./list.api";

export default class ListService {
  static async editList(listId: string, payload: any) {
    const response = await editList(listId, payload);
    return response;
  }

  static async deleteList(listId: string) {
    const response = await deleteList(listId);
    return response;
  }

  static async getListCards(listId: string) {
    const response = await getListCards(listId);
    if (!response || !response.success || !response.data) return [];
    return response.data;
  }

  static async createCardInList(boardId: string ,listId: string, payload: {
    name: string,
    description: string,
    priority: Priority,
    dueDate: string,

  }) {
    const response = await createCardInList(boardId ,listId, payload);
    return response;
  }
}
