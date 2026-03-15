import { Prisma, type BoardVisibility } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class BoardService {
  static async createBoard(
    userId: string,
    createBoardPayload: Prisma.BoardUncheckedCreateInput,
  ) {
    const board = await prisma.board.create({
      data: {
        ...createBoardPayload,
      },
    });

    await prisma.boardMember.create({
      data: {
        userId,
        boardId: board.id,
      },
    });
    return board;
  }



  static async getBoard(boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    return board;
  }

  static async editBoard(boardId: string, title: string, background: string) {
    const board = await prisma.board.update({
      where: { id: boardId },
      data: {
        title,
        background,
      },
    });

    return board;
  }

  static async deleteBoard(boardId: string) {
    const board = await prisma.board.delete({
      where: { id: boardId },
    });

    return board;
  }

  static async getMembers(boardId: string) {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return board?.members.map((m) => m.user);
  }

  static async addMembers(boardId: string, memberIds: string[]) {
    return await prisma.boardMember.createMany({
      data: memberIds.map((userId) => ({
        boardId,
        userId,
      })),
    });
  }

  static async deleteMember(boardId: string, userId: string) {
    await prisma.boardMember.delete({
      where: {
        userId_boardId: {
          boardId,
          userId,
        },
      },
    });
  }

  static async reorderBoard(boardId: string, prev: number, next: number) {
    const newPosition = (prev + next) / 2;

    return prisma.board.update({
      where: { id: boardId },
      data: { position: newPosition },
    });
  }
}
