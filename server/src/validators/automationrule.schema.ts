import { z } from "zod"

export const automationRuleSchema = z.object({
    boardId: z.uuid(),
    trigger: z.string(),
    condition: z.json(),
    action: z.json()
})