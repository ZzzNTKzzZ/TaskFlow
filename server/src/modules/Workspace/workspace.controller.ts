import type { Response, Request } from "express";
import { AppError } from "../../utils/appError.js";
import { WorkspaceService } from "./workspace.service.js";

export default class WorkspaceController {
  // POST: /workspaces
  static async createWorkspace(req: Request, res: Response) {
    const userId = req.user.id;

    const { name } = req.body;

    const workspace = await WorkspaceService.createWorkSpace(userId, name);

    res.status(201).json(workspace);
  }

  // GET: /workspaces
  static async getWorkspaces(req: Request, res: Response) {
    const userId = req.user.id;

    const workspaces = await WorkspaceService.getUserWorkspaces(userId);

    res.status(200).json(workspaces);
  }

  // GET: /workspaces/:workspaceId
  static async getWorkspaceById(req: Request, res: Response) {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const workspace = await WorkspaceService.getWorkspaceById(
      workspaceId as string,
      userId,
    );
    if (!workspace) throw new AppError("Not found workspace with id", 404);

    res.status(200).json(workspace);
  }

  // DELETE: /workspaces/:workspaceId
  static async deleteWorkspace(req: Request, res: Response) {
    const userId = req.user.id;
    const { workspaceId } = req.params;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const deletedWorkspace = await WorkspaceService.deleteWorkspace(
      workspaceId as string,
      userId,
    );

    res.status(200).json({ message: deletedWorkspace.message });
  }

  // PATCH: /workspaces/:workspaceId/members
  static async addMember(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const { userId, role } = req.body;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const member = await WorkspaceService.addMember(workspaceId, userId, role);

    res.status(201).json(member);
  }

  // GET /workspaces/:workspaceId/members
  static async getMembers(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);
    const members = await WorkspaceService.getMembers(workspaceId);

    res.status(200).json(members);
  }
  // PATCH /workspaces/:workspaceId/members/:memberId
  static async editMember(req: Request, res: Response) {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    const member = await WorkspaceService.editMember(
      workspaceId as string,
      memberId as string,
      role,
    );

    res.status(200).json(member);
  }

  // DELETE /workspaces/:workspaceId/members/:memberId
  static async deleteMember(req: Request, res: Response) {
    const { workspaceId, memberId } = req.params;
    const member = await WorkspaceService.deleteMember(
      workspaceId as string,
      memberId as string,
    );

    res.status(200).json({ message: "Delete success" });
  }

    // GET /workspaces/:workspaceId/boards
    static async getBoards(req: Request, res: Response) {
      const workspaceId = req.params.workspaceId as string;
  
      const boards = await WorkspaceService.getBoards(workspaceId);
  
      res.status(200).json(boards);
    }
}
