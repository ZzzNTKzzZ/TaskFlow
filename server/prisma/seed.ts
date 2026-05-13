import { BoardVisibility, Priority, TodoStatus, WorkspaceRole } from "../generated/prisma/index.js";
import { prisma } from "../src/lib/prisma.js";

const USER_ID = "fe461aeb-243f-4906-8a76-7dbd4882286f";

async function main() {
  for (let i = 1; i <= 15; i++) {
    // create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: `Workspace ${i}`,
        slug: `workspace-${i}-${Date.now()}`,
        members: {
          create: {
            userId: USER_ID,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    });

    // create board inside workspace
    const board = await prisma.board.create({
      data: {
        name: `Board ${i}`,
        background: `bg-${i}`,
        visibility: BoardVisibility.workspace,
        workspaceId: workspace.id,
        position: i,
        members: {
          create: {
            userId: USER_ID,
          },
        },
      },
    });

    // create todo
    await prisma.todo.create({
      data: {
        title: `Todo ${i}`,
        description: `Description for todo ${i}`,
        status:
          i % 3 === 0
            ? TodoStatus.done
            : i % 2 === 0
            ? TodoStatus.doing
            : TodoStatus.todo,
        priority:
          i % 4 === 0
            ? Priority.urgent
            : i % 3 === 0
            ? Priority.high
            : i % 2 === 0
            ? Priority.medium
            : Priority.low,
        userId: USER_ID,
      },
    });

    console.log(`created workspace ${workspace.id}`);
    console.log(`created board ${board.id}`);
  }
}

main()
  .then(async () => {
    console.log("seed completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });