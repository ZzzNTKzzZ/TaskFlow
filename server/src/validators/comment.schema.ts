import { z } from "zod"

export const commnetSchema = z.object({
    cardId: z.uuid(),
    content: z.string().min(1)
})
