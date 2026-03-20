import {
  Prisma,
  type BoardVisibility,
} from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/appError.js";
import BoardRepository from "./board.repository.js";

export default class BoardService {
  static async getBoard(boardId: string) {
    const board = await BoardRepository.findBoard(boardId);
    return board;
  }

  static async editBoard(
    boardId: string,
    title: string,
    visibility: BoardVisibility,
    background: string,
    position: number,
  ) {
    const existing = await BoardRepository.findBoard(boardId);
    if (!existing) throw new AppError("Board not found", 404);

    const board = await BoardRepository.updateBoard(
      boardId,
      title,
      visibility,
      background,
      position,
    );
    return board;
  }

  static async deleteBoard(boardId: string) {
    const existing = await BoardRepository.findBoard(boardId);
    if (!existing) throw new AppError("Board not found", 404);

    const board = await BoardRepository.deleteBoard(boardId);
    return board;
  }
  // ========================== BOARD MEMBER ==========================
  static async getMembers(boardId: string) {
    const members = await BoardRepository.findBoardMembers(boardId);
    return members.map((member) => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
    }));
  }

  static async addMembers(boardId: string, memberIds: string[]) {
    const board = await BoardRepository.findBoard(boardId);
    if (!board) throw new AppError("Board not found", 404);

    const existing = await BoardRepository.findExistingBoardMembers(
      boardId,
      memberIds,
    );

    const existingUserIds = new Set(existing.map((m) => m.userId));
    const newUserIds = memberIds.filter((id) => !existingUserIds.has(id));

    if (newUserIds.length === 0) {
      return {
        added: [],
        skipped: Array.from(existingUserIds),
      };
    }

    await BoardRepository.addMembers(boardId, newUserIds);
    return {
      added: newUserIds,
      skipped: Array.from(existingUserIds),
    };
  }

  static async deleteMember(boardId: string, userId: string) {
    const existing = await BoardRepository.findMember(boardId, userId);
    if (!existing) throw new AppError("Member not found", 404);

    await BoardRepository.deleteMember(boardId, userId);
    return { message: "Delete success" };
  }

  static async reorderBoard(boardId: string, prev: number, next: number) {
    const newPosition = (prev + next) / 2;

    const board = await BoardRepository.reorder(boardId, newPosition);

    return board;
  }
}
