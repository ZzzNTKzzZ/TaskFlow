import type { BoardVisibility } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class BoardRepository {
  static async findBoard(boardId: string) {
    return await prisma.board.findUnique({
      where: { id: boardId },
    });
  }

  static async updateBoard(
    boardId: string,
    title: string,
    visibility: BoardVisibility,
    background: string,
    position: number,
  ) {
    return await prisma.board.update({
      where: { id: boardId },
      data: {
        title,
        visibility,
        background,
        position,
      },
    });
  }

  static async deleteBoard(boardId: string) {
    return await prisma.board.delete({
      where: { id: boardId },
    });
  }

  // ========================== BOARD MEMBER ==========================
  static async findBoardMembers(boardId: string) {
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

  static async findMember(boardId: string, userId : string) {
    return await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId
        }
      },
      select : {
        userId: true,
      }
    })
  }

  static async addMembers(boardId: string, userIds: string[]) {
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
  static async deleteMember(boardId: string, userId: string) {
    return await prisma.boardMember.delete({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
  }


  static async findExistingBoardMembers(boardId: string, userIds: string[]) {
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

  // ========================== BOARD MEMBER ==========================

  static async reorder(boardId: string, position: number) {
    return await prisma.board.update({
      where: { id: boardId },
      data: {
        position,
      },
    });
  }
}
