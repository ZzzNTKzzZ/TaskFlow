import { prisma } from "../../lib/prisma.js";

export async function createTodoAction(data: any, payload: any) {
  const userId = payload.userId || data.userId;
  if (!userId) return;
  
  await prisma.todo.create({
    data: {
      name: data.name || "Automated Todo",
      description: data.description || null,
      status: data.status || "todo",
      priority: data.priority || "medium",
      userId,
    },
  });
}
