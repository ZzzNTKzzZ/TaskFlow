import {
  BoardVisibility,
  Priority,
  TodoStatus,
  WorkspaceRole,
} from "../generated/prisma/index.js";
import { prisma } from "../src/lib/prisma.js";

async function clearDatabase() {
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.checklistItem.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.labelOnCard.deleteMany();
  await prisma.label.deleteMany();
  await prisma.cardAssignee.deleteMany();
  await prisma.card.deleteMany();
  await prisma.list.deleteMany();
  await prisma.boardMember.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.board.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.todo.deleteMany();
  console.log("🧹 Database cleared (excluding Users)");
}

async function main() {
  // 1. Get or Create Current User
  let me = await prisma.user.findFirst();
  if (!me) {
    me = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@taskflow.com",
        password: "hashedpassword",
      },
    });
  }

  // 2. Create Dummy Users (Upsert so it doesn't fail if they exist)
  const dummyUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@taskflow.com" },
      update: {},
      create: { name: "Alice Nguyen", email: "alice@taskflow.com", password: "123" }
    }),
    prisma.user.upsert({
      where: { email: "bob@taskflow.com" },
      update: {},
      create: { name: "Bob Tran", email: "bob@taskflow.com", password: "123" }
    }),
    prisma.user.upsert({
      where: { email: "charlie@taskflow.com" },
      update: {},
      create: { name: "Charlie Le", email: "charlie@taskflow.com", password: "123" }
    }),
    prisma.user.upsert({
      where: { email: "diana@taskflow.com" },
      update: {},
      create: { name: "Diana Pham", email: "diana@taskflow.com", password: "123" }
    }),
  ]);
  const allUsers = [me, ...dummyUsers];

  // 3. Define Workspaces & Boards Structure
  const workspacesData = [
    {
      name: "Acme Corp Tech",
      boards: [
        { name: "Q3 Sprint Planning", bg: "DeepPrussianBlue" },
        { name: "Backend Refactoring", bg: "Blue" },
        { name: "DevOps & Infrastructure", bg: "Green" }
      ]
    },
    {
      name: "Design Studio",
      boards: [
        { name: "Website Redesign 2026", bg: "Orange" },
        { name: "Mobile App UI", bg: "Purple" }
      ]
    },
    {
      name: "Marketing & Sales",
      boards: [
        { name: "Q4 Ads Campaign", bg: "DeepPrussianBlue" },
        { name: "Social Media Calendar", bg: "Green" }
      ]
    },
    {
      name: "Personal Projects",
      boards: [
        { name: "Daily Routines", bg: "Blue" }
      ]
    }
  ];

  for (const [wIndex, wData] of workspacesData.entries()) {
    // Create Workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: wData.name,
        slug: wData.name.toLowerCase().replace(/\s+/g, "-") + `-${wIndex}`,
        members: {
          create: [
            { userId: me.id, role: WorkspaceRole.OWNER },
            { userId: dummyUsers[0].id, role: WorkspaceRole.ADMIN },
            { userId: dummyUsers[1].id, role: WorkspaceRole.MEMBER },
            { userId: dummyUsers[2].id, role: WorkspaceRole.MEMBER },
            { userId: dummyUsers[3].id, role: WorkspaceRole.VIEWER },
          ],
        },
      },
    });
    console.log(`🏢 Created Workspace: ${workspace.name}`);

    for (const [bIndex, bData] of wData.boards.entries()) {
      // ---------------------------------------------------------
      // TẠO BOARD (BẢNG CÔNG VIỆC)
      // Mỗi Workspace sẽ lặp qua mảng boards để tạo ra các Board tương ứng.
      // ---------------------------------------------------------
      const board = await prisma.board.create({
        data: {
          name: bData.name,
          background: bData.bg, // Giữ nguyên gradient string (DeepPrussianBlue, Blue...)
          visibility: BoardVisibility.workspace,
          workspaceId: workspace.id,
          position: bIndex + 1,
          members: {
            create: allUsers.map((u) => ({ userId: u.id })),
          },
        },
      });
      console.log(`  📊 Created Board: ${board.name}`);

      // ---------------------------------------------------------
      // TẠO LABELS (NHÃN DÁN) CHO BOARD
      // Tạo sẵn các nhãn dán cơ bản với các màu khác nhau để gán vào thẻ
      // ---------------------------------------------------------
      const labels = await Promise.all([
        prisma.label.create({ data: { boardId: board.id, name: "Bug/Issue", color: "#f87171" } }), 
        prisma.label.create({ data: { boardId: board.id, name: "Feature", color: "#60a5fa" } }), 
        prisma.label.create({ data: { boardId: board.id, name: "Design", color: "#c084fc" } }), 
        prisma.label.create({ data: { boardId: board.id, name: "Urgent", color: "#fb923c" } }), 
        prisma.label.create({ data: { boardId: board.id, name: "Research", color: "#4ade80" } }), 
      ]);

      // ---------------------------------------------------------
      // TẠO LISTS (CÁC CỘT TRẠNG THÁI)
      // Board nào cũng sẽ có 6 cột tiêu chuẩn theo luồng Agile/Scrum
      // ---------------------------------------------------------
      const listNames = ["Backlog", "To Do", "In Progress", "In Review", "QA Testing", "Done"];
      const lists = await Promise.all(
        listNames.map((name, i) =>
          prisma.list.create({
            data: { name, position: i + 1, boardId: board.id },
          })
        )
      );

      // ---------------------------------------------------------
      // TẠO CARDS (THẺ CÔNG VIỆC)
      // Tạo 12 thẻ cho mỗi Board và rải đều vào các List khác nhau
      // ---------------------------------------------------------
      const prios: Priority[] = [Priority.low, Priority.medium, Priority.high, Priority.urgent];

      for (let c = 0; c < 12; c++) {
        const listIndex = c % lists.length; // Trải đều thẻ vào 6 cột
        const randomPrio: Priority = prios[c % 4] as Priority;
        
        // Chỉ định ngẫu nhiên người thực hiện (Assignees)
        const assignees = [me.id];
        if (c % 2 === 0) assignees.push(dummyUsers[0]!.id);
        if (c % 3 === 0) assignees.push(dummyUsers[1]!.id);

        // Gắn ngẫu nhiên Nhãn (Labels)
        const labelIds = [];
        if (c % 2 === 0 && labels[0]) labelIds.push(labels[0].id);
        if (c % 3 === 0 && labels[1]) labelIds.push(labels[1].id);
        if (c % 5 === 0 && labels[3]) labelIds.push(labels[3].id);

        const targetList = lists[listIndex];
        if (!targetList) continue;

        const card = await prisma.card.create({
          data: {
            name: `Task ${c + 1} for ${board.name}`,
            description: `This is a detailed description for Task ${c + 1}. We need to ensure all criteria are met before moving this to the Done column.`,
            priority: randomPrio,
            position: c,
            listId: targetList.id,
            assignees: { create: assignees.map(userId => ({ userId })) },
            labels: { create: labelIds.map(labelId => ({ labelId })) },
            dueDate: new Date(Date.now() + 86400000 * (c - 5)), // Một số thẻ sẽ bị quá hạn (overdue), một số ở tương lai
          },
        });

        // Thêm Checklist (Danh sách kiểm tra) cho một số thẻ
        if (c % 4 === 0) {
          await prisma.checklist.create({
            data: {
              name: "Acceptance Criteria",
              cardId: card.id,
              items: {
                create: [
                  { name: "Write unit tests", isCompleted: true },
                  { name: "Pass CI/CD pipeline", isCompleted: false },
                  { name: "Code review approved", isCompleted: false },
                ],
              },
            },
          });
        }

        // ---------------------------------------------------------
        // TẠO COMMENTS VÀ ACTIVITY LOG CHO CÁC THẺ
        // Làm cho dữ liệu trông sinh động và chân thực như một nhóm đang làm việc
        // ---------------------------------------------------------
        if (c % 2 === 0) {
          const userChatMsg = [
            "Anh em cho mình hỏi đoạn này xử lý sao nhỉ?",
            "Đã test xong, pass 100% test case nha.",
            "UI màn hình này đang bị lệch ở mobile, nhờ design check lại.",
            "Can someone help me review this?",
            "Code sạch đẹp lắm, merge luôn nhé."
          ];
          const randomMsg = userChatMsg[c % userChatMsg.length] || "Looks great!";

          const comment1 = await prisma.comment.create({
            data: {
              cardId: card.id,
              authorId: dummyUsers[1]!.id,
              content: randomMsg,
            },
          });
          
          await prisma.activityLog.create({
            data: {
              boardId: board.id,
              userId: dummyUsers[1]!.id,
              cardId: card.id,
              listId: targetList.id,
              action: "COMMENT_CREATED",
              description: `Bob Tran commented on ${card.name}`,
            }
          });

          const comment2 = await prisma.comment.create({
            data: {
              cardId: card.id,
              authorId: me.id,
              content: "I will take a look at it this afternoon.",
            },
          });

          await prisma.activityLog.create({
            data: {
              boardId: board.id,
              userId: me.id,
              cardId: card.id,
              listId: targetList.id,
              action: "COMMENT_CREATED",
              description: `Admin User commented on ${card.name}`,
            }
          });
        }
      }

      // Generate Random Activity Logs for the Board
      const randomActivities = [
        { u: me, action: "BOARD_CREATED", desc: `created this board` },
        { u: dummyUsers[0]!, action: "LIST_CREATED", desc: `added list 'Backlog'` },
        { u: dummyUsers[1]!, action: "LIST_CREATED", desc: `added list 'To Do'` },
        { u: dummyUsers[2]!, action: "CARD_MOVED", desc: `moved a card from 'To Do' to 'In Progress'` },
        { u: dummyUsers[3]!, action: "CARD_ASSIGNED", desc: `joined a card` },
        { u: me, action: "CARD_UPDATED", desc: `changed the due date of a card` },
        { u: dummyUsers[0]!, action: "CHECKLIST_ITEM_COMPLETED", desc: `completed 'Write unit tests' on a checklist` },
      ];

      for (let i = 0; i < randomActivities.length; i++) {
        const item = randomActivities[i]!;
        await prisma.activityLog.create({
          data: {
            boardId: board.id,
            userId: item.u.id,
            action: item.action as any,
            description: `${item.u.name} ${item.desc}`,
            createdAt: new Date(Date.now() - 86400000 * (10 - i)), // Spread over the past 10 days
          }
        });
      }
    }
  }

  // Personal Todos
  await prisma.todo.create({
    data: {
      name: "Prepare Demo Presentation",
      description: "Thuyết trình 50 phút với hội đồng, focus vào JWT và Optimistic UI.",
      status: TodoStatus.doing,
      priority: Priority.urgent,
      userId: me.id,
    },
  });
  await prisma.todo.create({
    data: {
      name: "Review resume",
      description: "Cập nhật link Github repo vào CV.",
      status: TodoStatus.todo,
      priority: Priority.high,
      userId: me.id,
    },
  });
}

await clearDatabase();
main()
  .then(async () => {
    console.log("✅ MASSIVE SEED COMPLETED. Database is full of rich demo data!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });