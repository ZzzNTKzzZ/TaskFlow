import { BaseRepository } from "./base.repository.js";
import { prisma } from "../lib/prisma.js";

class ChecklistRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.checklist);
  }

  async findChecklist({ checklistId }: { checklistId: string }) {
    return prisma.checklist.findUnique({
      where: { id: checklistId },
    });
  }

  async findChecklists({ cardId }: { cardId: string }) {
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

  async createChecklist({
    data,
  }: {
    data: {
      name: string;
      cardId: string;
      items?: { name: string }[];
    };
  }) {
    const checklistData = {
      name: data.name,
      cardId: data.cardId,
      ...(data.items ? { items: { create: data.items } } : {}),
    };

    return prisma.checklist.create({
      data: checklistData,
      include: {
        items: {
          orderBy: { id: "asc" },
        },
      },
    });
  }

  async updateChecklist({
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

  async deleteChecklist({ checklistId }: { checklistId: string }) {
    return prisma.checklist.delete({
      where: { id: checklistId },
    });
  }

  async findChecklistItem({ itemId }: { itemId: string }) {
    return prisma.checklistItem.findUnique({
      where: { id: itemId },
    });
  }

  async createChecklistItem({
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

  async updateChecklistItem({
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

  async deleteChecklistItem({ itemId }: { itemId: string }) {
    return prisma.checklistItem.delete({
      where: { id: itemId },
    });
  }
}

export default new ChecklistRepository();
