import {
  type BoardVisibility,
} from "../../../generated/prisma/index.js";
import { AppError } from "../../utils/appError.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import ListRepository from "../List/list.repository.js";
import BoardRepository from "./board.repository.js";

export default class BoardService {
  // ========================== BOARD ==========================

  static async getBoard({ boardId }: { boardId: string }) {
    if (!boardId) throw new AppError("Board id is required", 400);

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    return board;
  }

  static async editBoard({
    boardId,
    title,
    visibility,
    background,
    position,
  }: {
    boardId: string;
    title?: string;
    visibility?: BoardVisibility;
    background?: string;
    position?: number;
  }) {
    const existing = await BoardRepository.findBoard({ boardId });
    if (!existing) throw new AppError("Board not found", 404);

    const payload = removeUndefined({
      title,
      visibility,
      background,
      position,
    });

    if (Object.keys(payload).length === 0) {
      throw new AppError("No fields provided for update", 400);
    }

    return BoardRepository.updateBoard({ boardId, data: payload });
  }

  static async deleteBoard({ boardId }: { boardId: string }) {
    if (!boardId) throw new AppError("Board id is required", 400);

    const existing = await BoardRepository.findBoard({ boardId });
    if (!existing) throw new AppError("Board not found", 404);

    await BoardRepository.deleteBoard({ boardId });

    return { message: "Board deleted" };
  }

  // ========================== MEMBERS ==========================

  static async getMembers({ boardId }: { boardId: string }) {
    if (!boardId) throw new AppError("Board id is required", 400);

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    const members = await BoardRepository.findBoardMembers({ boardId });

    return members.map((member) => ({
      id: member.id,
      userId: member.user.id,
      name: member.user.name,
    }));
  }

  static async addMembers({
    boardId,
    memberIds,
  }: {
    boardId: string;
    memberIds: string[];
  }) {
    if (!boardId) throw new AppError("Board id is required", 400);
    if (!memberIds || memberIds.length === 0) {
      throw new AppError("Member ids are required", 400);
    }

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    const existing = await BoardRepository.findExistingBoardMembers({
      boardId,
      userIds: memberIds,
    });

    const existingUserIds = new Set(existing.map((m) => m.userId));
    const newUserIds = memberIds.filter((id) => !existingUserIds.has(id));

    if (newUserIds.length === 0) {
      return {
        added: [],
        skipped: Array.from(existingUserIds),
      };
    }

    await BoardRepository.addMembers({
      boardId,
      userIds: newUserIds,
    });

    return {
      added: newUserIds,
      skipped: Array.from(existingUserIds),
    };
  }

  static async deleteMember({
    boardId,
    userId,
  }: {
    boardId: string;
    userId: string;
  }) {
    if (!boardId || !userId) {
      throw new AppError("Board id and user id are required", 400);
    }

    const existing = await BoardRepository.findMember({ boardId, userId });
    if (!existing) throw new AppError("Member not found", 404);

    await BoardRepository.deleteMember({ boardId, userId });

    return { message: "Member removed" };
  }


  // ========================== LIST ==========================

  static async getLists({ boardId }: { boardId: string }) {
    if (!boardId) throw new AppError("Board id is required", 400);

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    return BoardRepository.getLists({ boardId });
  }

  
    static async createList(input: { boardId: string; title: string }) {
    const { boardId, title } = input;
    if (!title) throw new AppError("List title is required", 400);

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    return ListRepository.createList({ boardId, title });
  }
  

  static async reorderList(
    input: {
      boardId: string;
      listId: string;
      beforeId?: string | null;
      afterId?: string | null;
    },
  ) {
    const { boardId, listId, beforeId, afterId } = input;

    const board = await BoardRepository.findBoard({ boardId });
    if (!board) throw new AppError("Board not found", 404);

    const list = await ListRepository.findList(listId);
    if (!list || list.boardId !== boardId) {
      throw new AppError("List not found on this board", 404);
    }

    const [before, after] = await Promise.all([
      beforeId ? ListRepository.findList(beforeId) : null,
      afterId ? ListRepository.findList(afterId) : null,
    ]);

    if (beforeId && !before) throw new AppError("Before list not found", 404);
    if (afterId && !after) throw new AppError("After list not found", 404);

    let newPosition: number;
    if (before && after) {
      newPosition = (before.position + after.position) / 2;
    } else if (before && !after) {
      newPosition = before.position + 1;
    } else if (!before && after) {
      newPosition = after.position - 1;
    } else {
      newPosition = 1;
    }

    return await ListRepository.reorder(listId, newPosition);
  }

}