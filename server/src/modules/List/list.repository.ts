import { prisma } from "../../lib/prisma.js";

export default class ListRepository {

  static async findList(listId: string) {
    return await prisma.list.findUnique({
      where: { id: listId },
    });
  }

  static async createList(input: { boardId: string; title: string }) {
    const { boardId, title } = input;
    return await prisma.list.create({
      data: {
        boardId,
        title,
        position: 0,
      },
    });
  }

  static async createLists({
    boardId,
    data,
  }: {
    boardId: string;
    data: { title: string; position: number }[];
  }) {
    return await prisma.list.createMany({
      data: data.map((item) => ({
        title: item.title,
        position: item.position,
        boardId: boardId,
      })),
      skipDuplicates: true,
    });
  }

  static async updateList(input: {
    listId: string;
    data: Partial<{
      title: string;
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
        assignees: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
  }
}
