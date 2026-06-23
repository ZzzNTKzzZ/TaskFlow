import { BaseRepository } from "./base.repository.js";
import type { ActivityType } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";


class ActivityRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.activityLog);
  }

  async createActivity(data: {
    boardId: string;
    userId: string;
    cardId?: string;
    listId?: string;
    action: ActivityType;
    description: string;
    metadata?: any;
  }) {
    return await prisma.activityLog.create({
      data,
    });
  }

  async findUserActivities({
    userId,
    limit,
    skip,
  }: {
    userId: string;
    limit: number;
    skip: number;
  }) {
    // Find all boards the user is a member of
    const userBoards = await prisma.boardMember.findMany({
      where: { userId },
      select: { boardId: true },
    });

    const boardIds = userBoards.map((b) => b.boardId);

    return await prisma.activityLog.findMany({
      where: {
        boardId: { in: boardIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        board: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });
  }

  async findBoardActivities({
    boardId,
    limit,
    skip,
  }: {
    boardId: string;
    limit: number;
    skip: number;
  }) {
    return await prisma.activityLog.findMany({
      where: { boardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        board: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });
  }

  async findWorkspaceActivities({
    workspaceId,
    limit,
    skip,
  }: {
    workspaceId: string;
    limit: number;
    skip: number;
  }) {
    const workspaceBoards = await prisma.board.findMany({
      where: { workspaceId },
      select: { id: true },
    });

    const boardIds = workspaceBoards.map((b) => b.id);

    return await prisma.activityLog.findMany({
      where: {
        boardId: { in: boardIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        board: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });
  }

  async findCardActivities({
    cardId,
    limit,
    skip,
  }: {
    cardId: string;
    limit: number;
    skip: number;
  }) {
    return await prisma.activityLog.findMany({
      where: { cardId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
    });
  }
}

export default new ActivityRepository();
