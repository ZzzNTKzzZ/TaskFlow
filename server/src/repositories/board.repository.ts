import { BaseRepository } from "./base.repository.js";
import { type BoardVisibility } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

class BoardRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.board);
  }

  async findBoard({ boardId }: { boardId: string }) {
    return await prisma.board.findUnique({
      where: {
        id: boardId,
      },
      include: {
        _count: {
          select: {
            members: true
          }
        },
        lists: {
          orderBy: {
            position: "asc",
          },
          include: {
            _count: {
              select: {
                cards: true
              }
            },
            cards: {
              orderBy: {
                position: "asc",
              },
              include: {
                assignees: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      }
                    }
                  }
                },
                checklists: {
                  orderBy: {
                    createdAt: "asc",
                  },
                  include: {
                    items: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateBoard({
    boardId,
    data,
  }: {
    boardId: string;
    data: Partial<{
      name: string;
      visibility: BoardVisibility;
      background: string;
      position: number;
    }>;
  }) {
    return await prisma.board.update({
      where: { id: boardId },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      data,
    });
  }

  async deleteBoard({ boardId }: { boardId: string }) {
    return await prisma.board.delete({
      where: { id: boardId },
    });
  }

  // ========================== BOARD MEMBER ==========================
  async findBoardMembers({ boardId }: { boardId: string }) {
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

  async findMember({
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

  async addMembers({
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

  async deleteMember({
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

  async findExistingBoardMembers({
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

  async reorder({
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

  async getLists({ boardId }: { boardId: string }) {
    return await prisma.list.findMany({
      where: { boardId },
      include: {
        _count: {
          select: { cards: true },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }
  async createList({
    boardId,
    name,
    position,
  }: {
    boardId: string;
    name: string;
    position: number;
  }) {
    return await prisma.list.create({
      data: {
        name,
        position,
        boardId,
      },
    });
  }
}

export default new BoardRepository();
