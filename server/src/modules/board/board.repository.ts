import { type BoardVisibility } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class BoardRepository {
  static async findBoard({ boardId }: { boardId: string }) {
    return await prisma.board.findUnique({
      where: { id: boardId },
    });
  }

  static async updateBoard({
    boardId,
    data,
  }: {
    boardId: string;
    data: Partial<{
      title: string;
      visibility: BoardVisibility;
      background: string;
      position: number;
    }>;
  }) {
    return await prisma.board.update({
      where: { id: boardId },
      data,
    });
  }

  static async deleteBoard({ boardId }: { boardId: string }) {
    return await prisma.board.delete({
      where: { id: boardId },
    });
  }

  // ========================== BOARD MEMBER ==========================
  static async findBoardMembers({ boardId }: { boardId: string }) {
    return await prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async findMember({
    boardId,
    userId,
  }: {
    boardId: string;
    userId: string;
  }) {
    return await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
      select: {
        userId: true,
      },
    });
  }

  static async addMembers({
    boardId,
    userIds,
  }: {
    boardId: string;
    userIds: string[];
  }) {
    await prisma.boardMember.createMany({
      data: userIds.map((userId) => ({
        userId,
        boardId,
      })),
      skipDuplicates: true,
    });

    return prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async deleteMember({
    boardId,
    userId,
  }: {
    boardId: string;
    userId: string;
  }) {
    return await prisma.boardMember.delete({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
  }

  static async findExistingBoardMembers({
    boardId,
    userIds,
  }: {
    boardId: string;
    userIds: string[];
  }) {
    return await prisma.boardMember.findMany({
      where: {
        boardId,
        userId: { in: userIds },
      },
      select: {
        userId: true,
      },
    });
  }

  // ========================== POSITION ==========================

  static async reorder({
    boardId,
    position,
  }: {
    boardId: string;
    position: number;
  }) {
    return await prisma.board.update({
      where: { id: boardId },
      data: {
        position,
      },
    });
  }

  // ========================== LIST ==========================

static async getLists({ boardId }: { boardId: string }) {
  return await prisma.list.findMany({
    where: { boardId },
    include: {
      _count: {
        select: { cards: true },
      },
    },
    orderBy:{ 
      position: "asc"
    }
  });
}
  static async createList({
    boardId,
    title,
    position
  }: {
    boardId: string;
    title: string;
    position: number
  }) {
    return await prisma.list.create({
      data: {
        title,
        position,
        boardId,
      },
    });
  }
}
