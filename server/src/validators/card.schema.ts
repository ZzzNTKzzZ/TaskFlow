import { z } from "zod";

export const createCardSchema = z.object({
  name: z.string().trim().min(1, "Card name is required"),
  description: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() !== "") {
      return new Date(arg);
    }
    if (arg instanceof Date) {
      return arg;
    }
    return null;
  }, z.date().nullable()).optional(),
});

export const updateCardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" && arg.trim() !== "") {
      return new Date(arg);
    }
    if (arg instanceof Date) {
      return arg;
    }
    return null;
  }, z.date().nullable()).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export const reorderCardSchema = z.object({
  cardId: z.uuid(),
  targetListId: z.uuid(),
  beforeId: z.uuid().optional(),
  afterId: z.uuid().optional(),
});