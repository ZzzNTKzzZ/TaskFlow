import type { Express } from "express"
import authRoutes from "./auth.routes.js"
export const routes = (app: Express) => {
    app.use("/auth", authRoutes)
}
