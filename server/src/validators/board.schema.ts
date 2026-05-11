import { z } from "zod";

const gradientRegex = /^linear-gradient\(.*\)$/i;
export const boardSchema = z.object({
  title: z.string().min(1),
  workspaceId: z.uuid(),
  visibility: z.enum(["private", "workspace", "public"]),
});

export const updateBoardSchema = z.object({
  title: z.string().optional(),
  background: z.union([
    z.string().optional(),
    z.url().refine((url) => /\.(jpg|jpeg|png|webp|avif)$/i.test(url), {
        message: "must be .jpg .jpeg .png .webp .avif"
    }),
    z.string().regex(gradientRegex).optional()
  ]),
});
