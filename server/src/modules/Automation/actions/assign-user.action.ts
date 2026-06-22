import { prisma } from "../../../lib/prisma.js";

export async function assignUserAction(data: any, payload: any) {
  const cardId = payload.cardId;
  const userId = data.userId || payload.userId;
  if (!cardId || !userId) return;

  await prisma.cardAssignee.createMany({
    data: [
      {
        cardId,
        userId,
      },
    ],
    skipDuplicates: true,
  });
}
