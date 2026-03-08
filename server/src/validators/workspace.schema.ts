import { z } from "zod"

export const workspaceSchema = z.object({
    name: z.string().min(3),
    slug: z.string().min(3)
})

export const updateWorkspaceSchema = z.object({
    name: z.string().optional()
})