import type { Express } from "express"
import authRoutes from "./auth.routes.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import workspaceRoutes from "./workspace.routes.js"
export const routes = (app: Express) => {
    app.use("/auth", authRoutes)
    app.use("/workspaces", authMiddleware, workspaceRoutes)
}
