import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import CardRepository from "../Card/card.repository.js";
import ListRepository from "./list.repository.js";

export default class ListService {
  static async editList(input: {
    listId: string;
    title?: string;
    position?: number;
  }) {
    const { listId, title, position } = input;
    const existing = await ListRepository.findList(listId);
    if (!existing) throw new AppError("List not found", 404);

    const payload = removeUndefined({ title, position });
    if (Object.keys(payload).length === 0) {
      throw new AppError("No fields provided for update", 400);
    }

    return ListRepository.updateList({ listId, data: payload });
  }

  static async deleteList({ listId }: { listId: string }) {
    const existing = await ListRepository.findList(listId);
    if (!existing) throw new AppError("List not found", 404);

    return ListRepository.deleteList(listId);
  }

  static async getCards({ listId }: { listId: string }) {
    const cards = await ListRepository.findCards({ listId });
    return cards;
  }

  static async createCard(data: {
    title: string;
    description?: string;
    listId: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string | Date | null;
  }) {
    if (!data.title || !data.listId) {
      throw new AppError("Title and listId are required", 400);
    }

    const priority = data.priority || "low";
    const maxPosition = await CardRepository.getMaxPosition({ listId: data.listId });
    const position = maxPosition + 65535;

    const card = await CardRepository.createCard({
      data: {
        title: data.title,
        description: data.description ?? null,
        listId: data.listId,
        position,
        priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return card;
  }
}
