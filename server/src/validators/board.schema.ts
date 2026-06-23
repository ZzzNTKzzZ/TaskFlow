import { z } from "zod";

const gradientRegex = /^linear-gradient\(.*\)$/i;

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  visibility: z.enum(["private", "workspace", "public"]),
  background: z.string().optional().nullable(),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).optional(),
  visibility: z.enum(["private", "workspace", "public"]).optional(),
  background: z.union([
    z.string().url().refine((url) => /\.(jpg|jpeg|png|webp|avif)$/i.test(url), {
        message: "must be .jpg .jpeg .png .webp .avif"
    }),
    z.string().regex(gradientRegex),
    z.string(),
  ]).optional().nullable(),
  position: z.number().optional(),
});

export const addBoardMembersSchema = z.object({
  memberIds: z.array(z.string().uuid()).min(1, "At least one member ID is required"),
});

export const reorderListSchema = z.object({
  listId: z.string().uuid(),
  beforeId: z.string().uuid().optional().nullable(),
  afterId: z.string().uuid().optional().nullable(),
});
