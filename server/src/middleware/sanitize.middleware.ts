import type { Request, Response, NextFunction } from "express";

const sanitize = (value: any): any => {
  if (typeof value === "string") {
    // Escaping < and > is enough to block execution of HTML/Script tags (XSS)
    // while keeping URLs, slashes, quotes, and other standard chars intact.
    return value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }
  if (value !== null && typeof value === "object") {
    const sanitizedObj: any = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitizedObj[key] = sanitize(value[key]);
      }
    }
    return sanitizedObj;
  }
  return value;
};

export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = sanitize(req.query[key]);
      }
    }
  }

  if (req.params) {
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        req.params[key] = sanitize(req.params[key]);
      }
    }
  }
  next();
};
