import { z } from "zod";

export const cardSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  listId: z.uuid(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date().nullable()),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export const updateCardSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date().nullable()),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export const reorderCardSchema = z.object({
  cardId: z.uuid(),
  targetListId: z.uuid(),
  beforeId: z.uuid().optional(),
  afterId: z.uuid().optional(),
});