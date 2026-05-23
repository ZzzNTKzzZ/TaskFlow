import { prisma } from "../../lib/prisma.js";

export default class ChecklistRepository {
  static async findChecklist({ checklistId }: { checklistId: string }) {
    return prisma.checklist.findUnique({
      where: { id: checklistId },
    });
  }

  static async findChecklists({ cardId }: { cardId: string }) {
    return prisma.checklist.findMany({
      where: { cardId },
      orderBy: { createdAt: "asc" },
      include: {
        items: {
          orderBy: { id: "asc" },
        },
      },
    });
  }

  static async createChecklist({
    data,
  }: {
    data: {
      name: string;
      cardId: string;
    };
  }) {
    return prisma.checklist.create({
      data,
    });
  }

  static async updateChecklist({
    checklistId,
    data,
  }: {
    checklistId: string;
    data: Partial<{
      name: string;
    }>;
  }) {
    return prisma.checklist.update({
      where: { id: checklistId },
      data,
    });
  }

  static async deleteChecklist({ checklistId }: { checklistId: string }) {
    return prisma.checklist.delete({
      where: { id: checklistId },
    });
  }

  static async findChecklistItem({ itemId }: { itemId: string }) {
    return prisma.checklistItem.findUnique({
      where: { id: itemId },
    });
  }

  static async createChecklistItem({
    data,
  }: {
    data: {
      name: string;
      checklistId: string;
    };
  }) {
    return prisma.checklistItem.create({
      data,
    });
  }

  static async updateChecklistItem({
    itemId,
    data,
  }: {
    itemId: string;
    data: Partial<{
      name: string;
      isCompleted: boolean;
    }>;
  }) {
    return prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });
  }

  static async deleteChecklistItem({ itemId }: { itemId: string }) {
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }
}
