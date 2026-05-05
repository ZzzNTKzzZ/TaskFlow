import type { Request, Response, NextFunction } from "express";
import { responseHandler } from "../utils/responseHandler.js";
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    const status = err.status || 500
    console.error("Status: ", status, " ", err)
    res.status(status).json(responseHandler.error(err.message))
};
