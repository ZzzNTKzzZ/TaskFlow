import type { NextFunction, Request, Response } from "express";
import permissions from "../permissions/permissions.map.js";
import type { PermissionAction } from "../permissions/permissions.map.js";
import { AppError } from "../utils/appError.js";

export const permissionMiddleware = (action: PermissionAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.workspaceRole;

    if (!role) {
      return next(new AppError("Workspace role not found", 404));
    }

    if (!permissions[action].includes(role)) {
      return next(new Error("Forbidden"));
    }
    next();
  };
};