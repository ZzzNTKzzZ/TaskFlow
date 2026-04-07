import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import BoardRepository from "../Board/board.repository.js";
import CardRepository from "./card.repository.js";

export default class CardService {

  // ================= CREATE =================
  static async createCard(data: {
    title: string;
    description?: string;
    listId: string;
    priority: "low" | "medium" | "high" | "urgent";
    dueDate?: Date;
  }) {
    const maxPosition = await CardRepository.getMaxPosition({
      listId: data.listId,
    });

    return CardRepository.createCard({
      data: {
        ...data,
        position: maxPosition + 65535,
      },
    });
  }

  // ================= UPDATE =================
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

    if (!Object.keys(payload).length) {
      throw new AppError("No fields provided for update", 400);
    }

    return CardRepository.updateCard({ cardId, data: payload });
  }

  // ================= DELETE =================
  static async deleteCard(cardId: string) {
    const existing = await CardRepository.findCard({ cardId });
    if (!existing) throw new AppError("Card not found", 404);

    return CardRepository.deleteCard({ cardId });
  }

  // ================= GET ASSIGNEES =================
  static async getAssignees(cardId: string) {
    return CardRepository.getAssigneesCard({ cardId });
  }

  // ================= ASSIGN USERS =================
  static async assignUsersToCard({
    cardId,
    userIds,
  }: {
    cardId: string;
    userIds: string[];
  }) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: true,
          },
        },
      },
    });

    if (!card) throw new AppError("Card not found", 404);

    if (!userIds.length) return [];

    const boardId = card.list.boardId;

    // lấy member hợp lệ
    const members = await BoardRepository.findExistingBoardMembers({
      boardId,
      userIds,
    });

    const validUserIds = members.map((m) => m.userId);

    if (!validUserIds.length) {
      throw new AppError("No valid users to assign", 400);
    }

    return await prisma.$transaction(async (tx) => {
      // create assignees
      const result = await tx.cardAssignee.createMany({
        data: validUserIds.map((userId) => ({
          userId,
          cardId,
        })),
        skipDuplicates: true,
      });

      // notification
      await tx.notification.createMany({
        data: validUserIds.map((userId) => ({
          userId,
          title: "Assigned to card",
          message: `You were assigned to card ${card.title}`,
        })),
      });

      return result;
    });
  }

  // ================= UNASSIGN =================
  static async unassignUserFromCard({
    cardId,
    userId,
  }: {
    cardId: string;
    userId: string;
  }) {
    const existing = await prisma.cardAssignee.findUnique({
      where: {
        userId_cardId: { userId, cardId },
      },
    });

    if (!existing) {
      throw new AppError("Assignee not found", 404);
    }

    await prisma.cardAssignee.delete({
      where: {
        userId_cardId: { userId, cardId },
      },
    });

    return { message: "Unassigned successfully" };
  }

  // ================= REORDER =================
  static async reorderCard(input: {
    cardId: string;
    targetListId: string;
    beforeId?: string | null;
    afterId?: string | null;
  }) {
    const { cardId, targetListId, beforeId, afterId } = input;

    const [existingCard, before, after] = await Promise.all([
      CardRepository.findCard({ cardId }),
      beforeId ? CardRepository.findCard({ cardId: beforeId }) : null,
      afterId ? CardRepository.findCard({ cardId: afterId }) : null,
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