import { z } from "zod"

export const registerSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),

  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z.string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {message: "Password must have uppercase letter"})
    .regex(/[0-9]/, {message: "Password must contain at least one number"})
})

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),

  password: z.string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
})