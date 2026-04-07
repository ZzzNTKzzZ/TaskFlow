import { z } from "zod"

export const listSchema = z.object({
    title: z.string().min(2),
})

export const updateListSchema = z.object({
    title: z.string().optional()
})