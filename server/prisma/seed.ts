import {
  BoardVisibility,
  Priority,
  TodoStatus,
  WorkspaceRole,
} from "../generated/prisma/index.js";
import { prisma } from "../src/lib/prisma.js";

const USER_ID = "4225abb4-8e06-4ab1-b6f3-1d6ff5c43f57";

async function clearDatabase() {
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.cardAssignee.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.board.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.todo.deleteMany();

  console.log("database cleared");
}

const workspaceNames = [
  "Engineering Team",
  "Marketing Team",
  "Personal Projects",
  "Startup Launch",
];

const boardTemplates = [
  "Sprint Planning",
  "Product Roadmap",
  "Bug Tracking",
  "Release Board",
];

const listTemplates = [
  "Backlog",
  "In Progress",
  "Review",
  "Done",
];

const cardTemplates = [
  {
    name: "Implement authentication",
    description: "Build login/register with JWT auth",
    priority: Priority.high,
  },
  {
    name: "Design mobile UI",
    description: "Create wireframe for dashboard screen",
    priority: Priority.medium,
  },
  {
    name: "Setup CI/CD",
    description: "Configure Github Actions deployment",
    priority: Priority.urgent,
  },
  {
    name: "Write unit tests",
    description: "Cover board service with tests",
    priority: Priority.low,
  },
];

async function createChecklist(cardId: string) {
  return prisma.checklist.create({
    data: {
      name: "Implementation steps",
      cardId,
      items: {
        create: [
          { name: "Analyze requirement", isCompleted: true },
          { name: "Write code" },
          { name: "Test feature" },
          { name: "Deploy production" },
        ],
      },
    },
  });
}

async function main() {
  for (let w = 0; w < 4; w++) {
    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceNames[w]!,
        slug: `${workspaceNames[w]!
          .toLowerCase()
          .replace(/\s/g, "-")}-${Date.now()}`,
        members: {
          create: {
            userId: USER_ID,
            role: WorkspaceRole.OWNER,
          },
        },
      },
    });

    console.log(`created workspace: ${workspace.name}`);

    // workspace đầu tiên có 4 boards, còn lại chỉ 1
    const boardCount = w === 0 ? 4 : 1;

    for (let b = 0; b < boardCount; b++) {
      const board = await prisma.board.create({
        data: {
          name: boardTemplates[b]!,
          background: `bg-${b + 1}`,
          visibility: BoardVisibility.workspace,
          workspaceId: workspace.id,
          position: b + 1,
          members: {
            create: {
              userId: USER_ID,
            },
          },
        },
      });

      console.log(`  created board: ${board.name}`);

      // board đầu tiên của workspace đầu tiên có 4 lists
      const listCount = w === 0 && b === 0 ? 4 : 1;

      for (let l = 0; l < listCount; l++) {
        const list = await prisma.list.create({
          data: {
            name: listTemplates[l]!,
            position: l + 1,
            boardId: board.id,
          },
        });

        console.log(`    created list: ${list.name}`);

        // mỗi list tạo 1-2 cards
        const cardCount = l === 0 ? 2 : 1;

        for (let c = 0; c < cardCount; c++) {
          const card = await prisma.card.create({
            data: {
              name: cardTemplates[c]!.name,
              description: cardTemplates[c]!.description,
              priority: cardTemplates[c]!.priority,
              position: c + 1,
              listId: list.id,
            },
          });

          console.log(`      created card: ${card.name}`);

          await createChecklist(card.id);

          console.log(`        created checklist`);
        }
      }
    }

    // personal todo mỗi workspace
    await prisma.todo.create({
      data: {
        name: `Todo for ${workspace.name}`,
        description: `Finish setup for ${workspace.name}`,
        status:
          w % 3 === 0
            ? TodoStatus.done
            : w % 2 === 0
            ? TodoStatus.doing
            : TodoStatus.todo,
        priority:
          w % 2 === 0 ? Priority.high : Priority.medium,
        userId: USER_ID,
      },
    });
  }
}

await clearDatabase()
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