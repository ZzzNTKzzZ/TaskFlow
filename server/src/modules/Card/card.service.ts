import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import CardRepository from "./card.repository.js";

export default class CardService {
  static async updateCard(cardId: string, data: any) {
    const existing = await CardRepository.findCard({ cardId });
    if (!existing) throw new AppError("Card not found", 404);

    const payload = removeUndefined({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      listId: data.listId,
      position: data.position,
    });

    if (Object.keys(payload).length === 0) {
      throw new AppError("No fields provided for update", 400);
    }

    return CardRepository.updateCard({ cardId, data: payload });
  }

  static async deleteCard(cardId: string) {
    const existing = await CardRepository.findCard({ cardId });
    if (!existing) throw new AppError("Card not found", 404);

    return CardRepository.deleteCard({ cardId });
  }

  static async reorderCard(input: {
    cardId: string;
    targetListId: string;
    beforeId?: string | null;
    afterId?: string | null;
  }) {
    const { cardId, targetListId, beforeId, afterId } = input;
    
    const [existingCard, before, after] = await Promise.all([
      CardRepository.findCard({cardId}),
      beforeId ? CardRepository.findCard({cardId: beforeId}) : null,
      afterId ? CardRepository.findCard({cardId: afterId}) : null,
    ]);

    if (!existingCard) throw new AppError("Card not found", 404);

    let newPosition: number;
    if (before && after) {
      newPosition = (before.position + after.position) / 2;
    } else if (before && !after) {
      newPosition = before.position + 65535;
    } else if (!before && after) {
      newPosition = after.position / 2;
    } else {
      newPosition = 65535; 
    }

    return CardRepository.updateCard({
      cardId,
      data: {
        listId: targetListId,
        position: newPosition,
      },
    });
  }
}
