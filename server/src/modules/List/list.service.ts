import { AppError } from "../../utils/appError.js";
import ListRepository from "./list.repository.js";

export default class ListServie {
  static async getLists(boardId: string) {
    const lists = await ListRepository.findLists(boardId);
    if (!lists) throw new AppError("Board not found", 404);
    return lists;
  }

  static async createList(boardId: string, title: string) {
    const list = await ListRepository.createList(boardId, title);
    return list;
  }

  static async editList(listId: string, title: string, position: number) {
    const existing = await ListRepository.findList(listId);
    if (!existing) throw new AppError("List not found", 404);
    const list = await ListRepository.updateList(listId, title, position);

    return list;
  }

  static async deleteList(listId: string) {
    const existing = await ListRepository.findList(listId);
    if (!existing) throw new AppError("List not found", 404);

    const list = await ListRepository.deleteList(listId);
    return list;
  }

  static async reorder(
    boardId: string,
    input: {
      listId: string;
      beforeId?: string | null;
      afterId?: string | null;
    },
  ) {
    const { listId, beforeId, afterId } = input;

    const [before, after] = await Promise.all([
      beforeId ? ListRepository.findList(beforeId) : null,
      afterId ? ListRepository.findList(afterId) : null,
    ]);

    let newPosition: number;
    if (before && after) {
      // In middle
      newPosition = (before.position + after.position) / 2;
    } else if (before && !after) {
      // In bottom
      newPosition = before.position + 1;
    } else if (!before && after) {
      // In top
      newPosition = after.position - 1;
    } else {
      // Empty
      newPosition = 1;
    }

    return await ListRepository.reorder(listId, newPosition)
  }
}
