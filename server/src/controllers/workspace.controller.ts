import type { Response, Request } from "express";
import { WorkspaceService } from "../services/workspace.service.js";
import { AppError } from "../utils/appError.js";

export default class WorkspaceController {
    // POST: /workspaces
    static async createWorkspace (req:Request, res: Response) {
        const userId = req.user.id

        const { name } = req.body

        const workspace = await WorkspaceService.createWorkSpace(userId, name)

        return res.status(201).json(workspace)
    }

    // GET: /workspaces 
    static async getWorkspaces (req:Request, res: Response) {
        const userId = req.user.id

        const workspaces = await WorkspaceService.getUserWorkspaces(userId)

        return res.status(200).json(workspaces)
    }

    // GET: /workspaces/:workspaceId
    static async getWorkspaceById(req:Request, res: Response) {
        const userId = req.user.id
        const { workspaceId }  = req.params

        if(!workspaceId) throw new AppError("Workspace id not provided", 400)

        const workspace = await WorkspaceService.getWorkspaceById(workspaceId as string, userId)
        if(!workspace) throw new AppError("Not found workspace with id", 404)
        
        return res.status(200).json(workspace)
    }

    // DELETE: /workspaces/:workspaceId
    static async deleteWorkspace(req:Request, res: Response) {
        const userId = req.user.id
        const { workspaceId } = req.params

        if(!workspaceId) throw new AppError("Workspace id not provided", 400)

        const deletedWorkspace = await WorkspaceService.deleteWorkspace(workspaceId as string, userId)

        return res.status(200).json({ message: deletedWorkspace.message})
    }
}