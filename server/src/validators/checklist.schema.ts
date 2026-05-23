import { z } from "zod";

export const createChecklistSchema = z.object({
  name: z.string().min(2),
});

export const updateChecklistSchema = z.object({
  name: z.string().min(2).optional(),
});

export const createChecklistItemSchema = z.object({
  name: z.string().min(2),
});

export const updateChecklistItemSchema = z.object({
  name: z.string().min(2).optional(),
  isCompleted: z.boolean().optional(),
});

export const completeChecklistItemSchema = z.object({
  isCompleted: z.boolean(),
});
