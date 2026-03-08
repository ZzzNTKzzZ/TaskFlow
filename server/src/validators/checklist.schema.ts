import { z } from "zod"

export const checkListSchema = z.object({
  title: z.string().min(2),
  cardId: z.uuid()
})

export const checkListItemSchema = z.object({
    title: z.string().optional(),
    checkListId: z.uuid()
})