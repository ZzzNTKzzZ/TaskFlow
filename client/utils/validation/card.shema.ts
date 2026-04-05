import { z } from "zod"

export const cardSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    listId: z.uuid(),
    dueDate: z.date().nullable(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
})

export const updateCardSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.date().nullable(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
})