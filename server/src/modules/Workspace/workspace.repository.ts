import { BoardVisibility, Priority } from "../../../generated/prisma/index.js";
import type { WorkspaceRole } from "../../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";

export default class WorkspaceRepository {
  static async findUserWorkspaces({ userId }: { userId: string }) {
    return await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            boards: true,
          },
        },
        members: {
          where: { userId },
          select: { role: true },
        },
        boards: {
          select: {
            lists: {
              select: {
                cards: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });
  }

  static async createWorkspace({
    userId,
    name,
    slug,
  }: {
    userId: string;
    name: string;
    slug: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
          members: {
            create: {
              userId,
              role: "OWNER",
            },
          },
          boards: {
            create: [
              {
                name: "Main Board",
                visibility: BoardVisibility.workspace,
                position: 0,
                members: {
                  create: {
                    userId,
                  },
                },
                lists: {
                  create: [
                    {
                      name: "To Do",
                      position: 0,
                      cards: {
                        create: [
                          {
                            name: "Getting Started",
                            description: null,
                            position: 0,
                            priority: Priority.low,
                            dueDate: null,
                            checklists: {
                              create: [
                                {
                                  name: "Setup Checklist",
                                  items: {
                                    create: [
                                      { name: "Complete workspace setup" },
                                      { name: "Invite team members" },
                                      { name: "Create your first task" },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      return workspace;
    });
  }

  static async findWorkspace({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    return await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        _count: {
          select: {
            members: true,
            boards: true,
          },
        },
        members: {
          where: { userId },
          select: { role: true },
        },
        boards: {
          select: {
            lists: {
              select: {
                cards: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });
  }

  static async updateWorkspace({
    workspaceId,
    name,
    slug,
  }: {
    workspaceId: string;
    name: string;
    slug: string;
  }) {
    return await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        slug,
      },
    });
  }

  static async deleteWorkspace({ workspaceId }: { workspaceId: string }) {
    return await prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }

  static async findWorkspaceBySlug({ slug }: { slug: string }) {
    return await prisma.workspace.findUnique({
      where: { slug },
    });
  }

  // ========================== WORKSPACE MEMBER ==========================
  static async findMembers({ workspaceId }: { workspaceId: string }) {
    return await prisma.workspaceMember.findMany({
      where: { workspaceId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });
  }

  static async findMember({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    return await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  static async addMember({
    workspaceId,
    userId,
    role,
  }: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }) {
    return await prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId,
        role: role || "MEMBER",
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
    });
  }

  static async updateMember({
    workspaceId,
    userId,
    role,
  }: {
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
  }) {
    return await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      data: {
        role,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        role: true,
      },
    });
  }

  static async deleteMember({
    workspaceId,
    userId,
  }: {
    workspaceId: string;
    userId: string;
  }) {
    return await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  // ========================== BOARD ==========================
  static async findBoards({
    workspaceId,
    limit,
  }: {
    workspaceId: string;
    limit?: number | undefined;
  }) {
    return await prisma.board.findMany({
      where: { workspaceId },
      include: {
        _count: {
          select: {
            members: true,
            lists: true,
          },
        },
        lists: {
          include: {
            _count: {
              select: {
                cards: true,
              },
            },
          },
        },
      },
      ...(typeof limit === "number" ? { take: limit } : {}),
    });
  }

  static async createBoard({
    workspaceId,
    name,
    visibility,
    background,
    userId,
  }: {
    workspaceId: string;
    name: string;
    visibility: BoardVisibility;
    background: string | null;
    userId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: {
          workspaceId,
          name,
          visibility,
          background,
          position: 0,
          members: {
            create: {
              userId,
            },
          },
          lists: {
            create: [
              {
                name: "To Do",
                position: 0,
                cards: {
                  create: [
                    {
                      name: "Getting Started",
                      description: null,
                      position: 0,
                      priority: Priority.low,
                      dueDate: null,
                      checklists: {
                        create: [
                          {
                            name: "Setup Checklist",
                            items: {
                              create: [
                                { name: "Complete workspace setup" },
                                { name: "Invite team members" },
                                { name: "Create your first task" },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      return board;
    });
  }
}
