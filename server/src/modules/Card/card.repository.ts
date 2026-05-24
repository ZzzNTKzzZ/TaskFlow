import { prisma } from "../../lib/prisma.js";

export default class CardRepository {
  static async findCard({ cardId }: { cardId: string }) {
    return await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        _count: {
          select: {
            checklists: true,
          },
        },
        checklists: {
          include: {
            items: {
              orderBy: { isCompleted: "asc"}
            }
          }
        }
      },
    });
  }

  static async createCard({
    data,
  }: {
    data: {
      name: string;
      description?: string | null;
      listId: string;
      position: number;
      priority: "low" | "medium" | "high" | "urgent";
      dueDate?: Date | null;
    };
  }) {
    return await prisma.card.create({
      data,
    });
  }

  static async createCardWithChecklist({
    data,
  }: {
    data: {
      name: string;
      description?: string | null;
      listId: string;
      position: number;
      priority: "low" | "medium" | "high" | "urgent";
      dueDate?: Date | null;
    };
  }) {
    return await prisma.$transaction(async (tx) => {
      const card = await tx.card.create({
        data: {
          ...data,
        },
      });

      await tx.checklist.create({
        data: {
          name: "Task Checklist",
          cardId: card.id,
          items: {
            create: [
              { name: "Item 1" },
              { name: "Item 2" },
              { name: "Item 3" },
            ],
          },
        },
      });

      return card;
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
    return await prisma.card.update({
      where: { id: cardId },
      data,
    });
  }

  static async deleteCard({ cardId }: { cardId: string }) {
    return await prisma.card.delete({
      where: { id: cardId },
    });
  }

  static async getMaxPosition({ listId }: { listId: string }) {
    const card = await prisma.card.findFirst({
      where: { listId },
      orderBy: { position: "desc" },
    });
    return card?.position ?? 0;
  }

  static async getAssigneesCard({ cardId }: { cardId: string }) {
    return await prisma.cardAssignee.findMany({
      where: {
        cardId,
      },
      include: {
        user: true,
      },
    });
  }

  static async createAssigneesCard({
    cardId,
    userIds,
  }: {
    cardId: string;
    userIds: string[];
  }) {
    return await prisma.cardAssignee.createMany({
      data: userIds.map((userId) => ({
        userId,
        cardId,
      })),
      skipDuplicates: true,
    });
  }

  static async deleteAssigneesCard({
    cardId,
    userId,
  }: {
    cardId: string;
    userId: string;
  }) {
    return await prisma.cardAssignee.delete({
      where: {
        userId_cardId: {
          userId,
          cardId,
        },
      },
    });
  }
}
