import type { NextFunction, Request, Response } from "express";
import permissions from "../permissions/permissions.map.js";
import type { PermissionAction } from "../permissions/permissions.map.js";
import { AppError } from "../utils/appError.js";

export const permissionMiddleware = (action: PermissionAction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.workspaceMember?.role;
    if (!role) throw new AppError("Role not defined", 500);

    const allowedRoles = permissions[action];
    if (!allowedRoles) {
      throw new AppError("Permission not defined", 500);
    }

    if (!allowedRoles.includes(role)) {
      throw new AppError("Permission denied", 500);
    }
    next();
  };
};
