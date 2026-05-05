import { z } from "zod"

export const listSchema = z.object({
    name: z.string().min(2),
})

export const updateListSchema = z.object({
    name: z.string().optional()
})

export const editListSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    position: z.number().optional()
})

