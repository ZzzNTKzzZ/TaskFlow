import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export default class CardRepository {


  static async findCard({ cardId }: { cardId: string }) {
    return prisma.card.findUnique({
      where: { id: cardId },
    });
  }

  static async createCard({
    data,
  }: {
    data: {
      title: string;
      description?: string | null;
      listId: string;
      position: number;
      priority: "low" | "medium" | "high" | "urgent";
      dueDate?: Date | null;
    };
  }) {
    return prisma.card.create({
      data,
    });
  }

  static async updateCard({
    cardId,
    data,
  }: {
    cardId: string;
    data: Partial<{
      title: string;
      description: string;
      priority: "low" | "medium" | "high" | "urgent";
      dueDate: Date | null;
      listId: string;
      position: number;
    }>;
  }) {
    return prisma.card.update({
      where: { id: cardId },
      data,
    });
  }

  static async deleteCard({ cardId }: { cardId: string }) {
    return prisma.card.delete({
      where: { id: cardId },
    });
  }

  static async getMaxPosition({ listId }: { listId: string }) {
    const card = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });
    return card?.position || 0;
  }
}