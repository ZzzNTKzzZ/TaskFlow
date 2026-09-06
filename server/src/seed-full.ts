import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Cleaning up existing database...");
  // Xóa toàn bộ dữ liệu hiện tại để tránh trùng lặp
  await prisma.workspace.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Starting full database seed...");
  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Tạo Users (1 Admin, 3 Members)
  const users = await Promise.all([
    prisma.user.create({ data: { email: "admin@test.com", name: "Admin", password: passwordHash } }),
    prisma.user.create({ data: { email: "alice@test.com", name: "Alice", password: passwordHash } }),
    prisma.user.create({ data: { email: "bob@test.com", name: "Bob", password: passwordHash } }),
    prisma.user.create({ data: { email: "charlie@test.com", name: "Charlie", password: passwordHash } }),
  ]);
  const [admin, alice, bob, charlie] = users;

  // 2. Tạo Todo cá nhân cho từng user (Để chứng minh bảng Todo cũng hoạt động)
  for (const u of users) {
    await prisma.todo.createMany({
      data: [
        { name: `Check email for ${u.name}`, status: "todo", priority: "low", userId: u.id },
        { name: `Weekly meeting prep`, status: "doing", priority: "high", userId: u.id },
      ]
    });
  }

  // 3. Tạo Workspace chung
  const workspace = await prisma.workspace.create({
    data: {
      name: "Super Global Corp",
      slug: `super-global-${Date.now()}`,
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: alice.id, role: "MEMBER" },
          { userId: bob.id, role: "MEMBER" },
          { userId: charlie.id, role: "VIEWER" }, // Charlie chỉ được phép xem
        ],
      },
    },
  });

  // 4. Tạo các Boards (Bảng)
  const boardNames = ["Phát triển phần mềm", "Chiến dịch Marketing", "Kế hoạch nhân sự"];
  
  for (let i = 0; i < boardNames.length; i++) {
    const bName = boardNames[i] || `Board ${i + 1}`;
    const board = await prisma.board.create({
      data: {
        name: bName,
        workspaceId: workspace.id,
        visibility: "workspace",
        position: i,
        // Add all users to all boards
        members: {
          create: [{ userId: admin.id }, { userId: alice.id }, { userId: bob.id }, { userId: charlie.id }],
        },
        // Tạo sẵn các Labels màu cho Board
        labels: {
          create: [
            { name: "Bug", color: "#EF4444" },
            { name: "Tính năng", color: "#3B82F6" },
            { name: "Gấp", color: "#F59E0B" }
          ]
        }
      },
    });

    const labels = await prisma.label.findMany({ where: { boardId: board.id } });

    // Tạo các Danh sách (Lists)
    const listNames = ["Backlog", "To Do", "In Progress", "Review", "Done"];
    
    for (let j = 0; j < listNames.length; j++) {
      const lName = listNames[j] || `List ${j + 1}`;
      const list = await prisma.list.create({
        data: {
          name: lName,
          boardId: board.id,
          position: j,
        }
      });

      // Tạo các Thẻ (Cards) vào trong List
      // Mỗi list tạo 3 cards phân bổ cho các member khác nhau
      for (let k = 0; k < 3; k++) {
        const assignees = [];
        if (k === 0) assignees.push({ userId: admin.id }); // Việc admin
        if (k === 1) assignees.push({ userId: alice.id }); // Việc Alice
        if (k === 2) assignees.push({ userId: bob.id }, { userId: admin.id }); // Làm chung

        const targetLabel = labels.length > 0 ? labels[k % labels.length] : null;

        const cardData: any = {
          name: `${board.name} - ${list.name} Task ${k + 1}`,
          description: `Mô tả chi tiết công việc cho task ${k+1}. Cần hoàn thành trước deadline.`,
          priority: k === 0 ? "urgent" : (k === 1 ? "high" : "medium"),
          listId: list.id,
          position: k,
          assignees: { create: assignees },
          checklists: {
            create: [
              {
                name: "Danh sách công việc con",
                items: {
                  create: [
                    { name: "Nghiên cứu tài liệu", isCompleted: true },
                    { name: "Báo cáo kết quả", isCompleted: false }
                  ]
                }
              }
            ]
          },
          comments: {
            create: [
              { content: "Hãy làm phần này cẩn thận nhé!", authorId: admin.id }
            ]
          }
        };

        if (targetLabel) {
          cardData.labels = { create: [{ labelId: targetLabel.id }] };
        }

        const card = await prisma.card.create({
          data: cardData,
        });

        // Thêm Log lịch sử hoạt động
        await prisma.activityLog.create({
          data: {
            boardId: board.id,
            listId: list.id,
            cardId: card.id,
            userId: admin.id,
            action: "CARD_CREATED",
            description: `đã tạo thẻ "${card.name}"`,
          }
        });
      }
    }
  }

  console.log("✅ Toàn bộ cơ sở dữ liệu đã được tự động Fill thành công!");
  console.log("======================================");
  console.log("TÀI KHOẢN ĐĂNG NHẬP (Mật khẩu: 123456):");
  console.log("1. Admin: admin@test.com");
  console.log("2. Alice: alice@test.com");
  console.log("3. Bob: bob@test.com");
  console.log("4. Charlie: charlie@test.com");
  console.log("======================================");
}

main().catch(console.error).finally(() => prisma.$disconnect());
