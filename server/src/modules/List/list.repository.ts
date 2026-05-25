import { Priority } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class ListRepository {
  static async findList(listId: string) {
    return await prisma.list.findUnique({
      where: { id: listId },
    });
  }

  static async createList(input: { boardId: string; name: string }) {
    const { boardId, name } = input;
    return await prisma.list.create({
      data: {
        boardId,
        name,
        position: 0,
      },
    });
  }

  static async createListWithDefaults({
    boardId,
    name,
  }: {
    boardId: string;
    name: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const list = await tx.list.create({
        data: {
          boardId,
          name,
          position: 0,
        },
      });

      const card = await tx.card.create({
        data: {
          name: "New Task",
          description: null,
          listId: list.id,
          position: 0,
          priority: Priority.low,
          dueDate: null,
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
        include: {
          items: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      });

      return list;
    });
  }

  static async createLists({
    boardId,
    data,
  }: {
    boardId: string;
    data: { name: string; position: number }[];
  }) {
    return await prisma.list.createMany({
      data: data.map((item) => ({
        name: item.name,
        position: item.position,
        boardId: boardId,
      })),
      skipDuplicates: true,
    });
  }

  static async updateList(input: {
    listId: string;
    data: Partial<{
      name: string;
      position: number;
    }>;
  }) {
    const { listId, data } = input;
    return await prisma.list.update({
      where: { id: listId },
      data,
    });
  }

  static async deleteList(listId: string) {
    return await prisma.list.delete({
      where: { id: listId },
    });
  }

  static async reorder(listId: string, position: number) {
    return await prisma.list.update({
      where: { id: listId },
      data: {
        position,
      },
    });
  }

  static async findCards({ listId }: { listId: string }) {
    return prisma.card.findMany({
      where: { listId },
      orderBy: { position: "asc" },
      include: {
        labels: { include: { label: true } },
        assignees: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }
}
