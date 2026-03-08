import { z } from "zod"

const hexRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
const gradientRegex = /^linear-gradient\(.*\)$/i;
export const boardSchema = z.object({
    title: z.string().min(1),
    workspaceId: z.uuid(),
    visibility: z.enum(["private", "workspace", "public"])
})

export const updateBoardSchema = z.object({
    ttile: z.string().optional(),
    background: z.union([
        z.string().regex(hexRegex),
        z.url().refine((url) => {
            /\.(jpg|jpeg|png|webp|avif)$/i.test(url)
        }),
        z.string().regex(gradientRegex)
    ])
})