import type { Response, Request } from "express";
import { AppError } from "../../utils/appError.js";
import { WorkspaceService } from "./workspace.service.js";

export default class WorkspaceController {
  // GET: /workspaces
  static async getWorkspaces(req: Request, res: Response) {
    const userId = req.user.userId;

    const workspaces = await WorkspaceService.getUserWorkspaces(userId);

    res.status(200).json(workspaces);
  }
  // POST: /workspaces
  static async createWorkspace(req: Request, res: Response) {
    const userId = req.user.userId;

    const { name } = req.body;

    const workspace = await WorkspaceService.createWorkSpace(userId, name);

    res.status(201).json(workspace);
  }

  // GET: /workspaces/:workspaceId
  static async getWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;
    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const workspace = await WorkspaceService.getWorkspace(
      workspaceId as string,
    );
    if (!workspace) throw new AppError("Not found workspace with id", 404);

    res.status(200).json(workspace);
  }

  // PATCH: /workspaces/:workspaceId
  static async editWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const { name } = req.body;
    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const workspace = await WorkspaceService.editWorkspace(
      workspaceId as string,
      name,
    );

    if (!workspace) throw new AppError("Forbidden", 500);

    res.status(200).json(workspace);
  }

  // DELETE: /workspaces/:workspaceId
  static async deleteWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const deletedWorkspace = await WorkspaceService.deleteWorkspace(
      workspaceId as string,
    );

    res.status(200).json({ message: deletedWorkspace.message });
  }

  // ========================== WORKSPACE MEMBER ==========================

  // GET /workspaces/:workspaceId/members
  static async getMembers(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;

    if (!workspaceId) throw new AppError("Workspace id not provided", 400);
    const members = await WorkspaceService.getMembers(workspaceId);

    res.status(200).json(members);
  }

  // PATCH: /workspaces/:workspaceId/members
  static async addMember(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const { userId, role } = req.body;
    if (!workspaceId) throw new AppError("Workspace id not provided", 400);

    const member = await WorkspaceService.addMember(workspaceId, userId, role);

    res.status(201).json(member);
  }

  // PATCH /workspaces/:workspaceId/members/:memberId
  static async editMember(req: Request, res: Response) {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    if(!workspaceId || !memberId) throw new AppError("Missing params", 400)

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
    if(!workspaceId || !memberId) throw new AppError("Missing params", 400)

    await WorkspaceService.deleteMember(
      workspaceId as string,
      memberId as string,
    );

    res.status(200).json({ message: "Member removed" });
  }

  // GET /workspaces/:workspaceId/boards
  static async getBoards(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;

    const boards = await WorkspaceService.getBoards(workspaceId);

    res.status(200).json(boards);
  }

  // POST /workspaces/:workspaceId/boards
  static async createBoard(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string
    const { title, visibility, background } = req.body
    const userId = req.user.id
    
    const board = await WorkspaceService.createBoard(workspaceId, title, visibility, background, userId)

    res.status(200).json()
  }
}
