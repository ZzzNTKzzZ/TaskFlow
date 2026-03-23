import { prisma } from "../../lib/prisma.js";

export default class ListRepository {
  static async findLists(boardId: string) {
    return await prisma.board.findMany({
      where: { id: boardId },
      orderBy: { position: "asc"},
      include: {
        lists: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            lists: true,
          },
        },
      },
    });
  }

  static async findList(listId: string) {
    return await prisma.list.findUnique({
      where: { id: listId },
    });
  }

  static async createList(boardId: string, title: string) {
    return await prisma.list.create({
      data: {
        title,
        position: 0,
        boardId,
      },
    });
  }

  static async updateList(listId: string, title: string, position: number) {
    return await prisma.list.update({
      where: { id: listId },
      data: {
        title,
        position,
      },
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
}
