import { prisma } from "../lib/prisma.js";

export interface SearchResult {
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    memberCount: number;
    boardCount: number;
  }>;
  boards: Array<{
    id: string;
    name: string;
    background: string | null;
    workspaceId: string;
    workspaceName: string;
  }>;
  cards: Array<{
    id: string;
    name: string;
    description: string | null;
    priority: string;
    dueDate: Date | null;
    listId: string;
    listName: string;
    boardId: string;
    boardName: string;
    workspaceId: string;
    workspaceName: string;
  }>;
}

export class SearchService {
  static async search(userId: string, query: string): Promise<SearchResult> {
    const trimmed = (query || "").trim();
    if (!trimmed) {
      return { workspaces: [], boards: [], cards: [] };
    }

    // 1. Find all workspace IDs the user belongs to
    const userWorkspaceMembers = await prisma.workspaceMember.findMany({
      where: { userId },
      select: { workspaceId: true },
    });
    const workspaceIds = userWorkspaceMembers.map((m) => m.workspaceId);

    // 2. Search Workspaces
    const matchedWorkspaces = await prisma.workspace.findMany({
      where: {
        id: { in: workspaceIds },
        name: { contains: trimmed, mode: "insensitive" },
      },
      include: {
        _count: {
          select: { members: true, boards: true },
        },
      },
      take: 8,
    });

    const workspaces = matchedWorkspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      memberCount: ws._count.members,
      boardCount: ws._count.boards,
    }));

    // 3. Search Boards
    const matchedBoards = await prisma.board.findMany({
      where: {
        OR: [
          { workspaceId: { in: workspaceIds } },
          { members: { some: { userId } } },
        ],
        name: { contains: trimmed, mode: "insensitive" },
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
      },
      take: 10,
    });

    const boards = matchedBoards.map((b) => ({
      id: b.id,
      name: b.name,
      background: b.background,
      workspaceId: b.workspaceId,
      workspaceName: b.workspace.name,
    }));

    // 4. Search Cards
    // Get accessible board IDs
    const userBoards = await prisma.board.findMany({
      where: {
        OR: [
          { workspaceId: { in: workspaceIds } },
          { members: { some: { userId } } },
        ],
      },
      select: { id: true },
    });
    const accessibleBoardIds = userBoards.map((b) => b.id);

    const matchedCards = await prisma.card.findMany({
      where: {
        list: { boardId: { in: accessibleBoardIds } },
        OR: [
          { name: { contains: trimmed, mode: "insensitive" } },
          { description: { contains: trimmed, mode: "insensitive" } },
        ],
      },
      include: {
        list: {
          select: {
            id: true,
            name: true,
            board: {
              select: {
                id: true,
                name: true,
                workspace: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
      take: 15,
    });

    const cards = matchedCards.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      priority: c.priority,
      dueDate: c.dueDate,
      listId: c.list.id,
      listName: c.list.name,
      boardId: c.list.board.id,
      boardName: c.list.board.name,
      workspaceId: c.list.board.workspace.id,
      workspaceName: c.list.board.workspace.name,
    }));

    return { workspaces, boards, cards };
  }
}
