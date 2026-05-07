import { type z, type ZodRawShape } from "zod";
import type { Response, Request, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
export const validateMiddleware =
  <T extends ZodRawShape>(schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
      return next(new AppError(
        `${result.error.issues[0]?.message}`,
        400
      ))
    }

    req.body = result.data
    next()
  };
