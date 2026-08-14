import { prisma } from "./lib/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Starting advanced seed...");

  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: { email: "admin@test.com", name: "Admin User", password: passwordHash },
  });

  const member1 = await prisma.user.upsert({
    where: { email: "member1@test.com" },
    update: {},
    create: { email: "member1@test.com", name: "Alice (Member 1)", password: passwordHash },
  });

  const member2 = await prisma.user.upsert({
    where: { email: "member2@test.com" },
    update: {},
    create: { email: "member2@test.com", name: "Bob (Member 2)", password: passwordHash },
  });

  const member3 = await prisma.user.upsert({
    where: { email: "member3@test.com" },
    update: {},
    create: { email: "member3@test.com", name: "Charlie (Member 3)", password: passwordHash },
  });

  console.log("Users created:", admin.email, member1.email, member2.email, member3.email);

  // 2. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Dự án Thiết Kế App",
      slug: `du-an-app-${Date.now()}`,
      members: {
        create: [
          { userId: admin.id, role: "OWNER" },
          { userId: member1.id, role: "MEMBER" },
          { userId: member2.id, role: "MEMBER" },
          { userId: member3.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("Workspace created:", workspace.name);

  // 3. Create Board with Multiple Lists and Tasks
  const board = await prisma.board.create({
    data: {
      name: "Sprint 1",
      workspaceId: workspace.id,
      visibility: "workspace",
      position: 0,
      members: {
        create: [
          { userId: admin.id },
          { userId: member1.id },
          { userId: member2.id },
          { userId: member3.id },
        ],
      },
      lists: {
        create: [
          {
            name: "To Do",
            position: 0,
            cards: {
              create: [
                {
                  name: "Thiết kế UI màn hình Đăng nhập",
                  description: "Tạo wireframe và mockup cho màn hình Login/Register",
                  priority: "high",
                  position: 0,
                  assignees: { create: [{ userId: member1.id }] },
                },
                {
                  name: "Viết tài liệu API",
                  description: "Cập nhật Swagger cho phần Authentication",
                  priority: "medium",
                  position: 1,
                  assignees: { create: [{ userId: member2.id }] },
                },
                {
                  name: "Tìm kiếm ý tưởng Logo",
                  description: "Tham khảo Dribbble để tìm cảm hứng",
                  priority: "low",
                  position: 2,
                  assignees: { create: [{ userId: member3.id }] },
                },
              ],
            },
          },
          {
            name: "In Progress",
            position: 1,
            cards: {
              create: [
                {
                  name: "Phát triển Backend Đăng nhập",
                  description: "Code logic đăng nhập và xử lý JWT",
                  priority: "urgent",
                  position: 0,
                  assignees: { create: [{ userId: admin.id }, { userId: member2.id }] },
                },
                {
                  name: "Thống nhất Palette màu sắc",
                  description: "Bàn bạc và chốt màu chủ đạo",
                  priority: "high",
                  position: 1,
                  assignees: { create: [{ userId: member1.id }, { userId: member3.id }] },
                },
              ],
            },
          },
          {
            name: "Done",
            position: 2,
            cards: {
              create: [
                {
                  name: "Thiết lập dự án (Cấu trúc thư mục)",
                  description: "Khởi tạo Github repo và folder",
                  priority: "low",
                  position: 0,
                  assignees: { create: [{ userId: admin.id }] },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Board created:", board.name);
  console.log("Advanced Seed completed successfully!");
  console.log("======================================");
  console.log("LOGIN CREDENTIALS (Mật khẩu chung: 123456):");
  console.log("- Admin (Quản lý chung): admin@test.com");
  console.log("- Alice (Dev/Design)   : member1@test.com");
  console.log("- Bob (Dev Backend)    : member2@test.com");
  console.log("- Charlie (Marketing)  : member3@test.com");
  console.log("======================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
