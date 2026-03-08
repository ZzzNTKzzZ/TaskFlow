import { z } from "zod"

export const todoSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    status: z.enum(["todo", "doing", "done"]),
    dueDate: z.date().optional(),
})

export const updateTodoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "doing", "done"]),
    priority: z.enum(["low", "medium", "high", "urgent"]),
})

