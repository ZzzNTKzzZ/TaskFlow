import { prisma } from "../../lib/prisma.js";
import BoardRepository from "../Board/board.repository.js";
import CardRepository from "../Card/card.repository.js";
import ListRepository from "../List/list.repository.js";
import WorkspaceRepository from "./workspace.repository.js";

export default async function createDefaultWorkspaceData(
  workspaceId: string,
  userId: string,
) {
  // 1. tạo board mặc định
  const board = await WorkspaceRepository.createBoard({
    workspaceId,
    title: "Getting Started",
    visibility: "workspace",
    background: "",
    userId,
  });

  const lists = await ListRepository.createLists({
  boardId: board.id,
  data: [
    { title: "Todo", position: 1 },
    { title: "Doing", position: 2 },
    { title: "Done", position: 3 },
  ],
});

  const allLists = await ListRepository.findLists(board.id)
  // 3. tạo card mẫu
  const todoList = allLists[0];

const data = {
    title: "Welcome 🎉",
    description: "This is your first task",
    listId: todoList?.id as string, 
    position: 1,
    priority: "low" as const, 
  };

  const card = await CardRepository.createCard({ data });


  return {
    board,
    lists,
    card,
  };
}