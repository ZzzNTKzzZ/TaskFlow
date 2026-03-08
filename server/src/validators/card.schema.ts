import { z } from "zod"

export const cardSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    listId: z.uuid(),
    dueDate: z.date().optional()
})

export const updateCardSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    dueDate: z.date().optional()
})