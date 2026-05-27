import type { Response, Request } from "express";
import { AppError } from "../../utils/appError.js";
import { WorkspaceService } from "./workspace.service.js";
import { responseHandler } from "../../utils/responseHandler.js";
import { ActivityService } from "../Activity/activity.service.js";

export default class WorkspaceController {
  // GET: /workspaces
  static async getWorkspaces(req: Request, res: Response) {
    const userId = req.user.userId;
    const { limit } = req.query
    const workspaces = await WorkspaceService.getUserWorkspaces({ userId, limit: Number(limit)  });
    res.status(200).json(responseHandler.success(workspaces));
  }
  // POST: /workspaces
  static async createWorkspace(req: Request, res: Response) {
    const userId = req.user.userId;
    const { name } = req.body;
    const workspace = await WorkspaceService.createWorkSpace({ userId, name });
    res.status(201).json(responseHandler.success(workspace));
  }

  // GET: /workspaces/:workspaceId
  static async getWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const userId = req.user.userId;
    const workspace = await WorkspaceService.getWorkspace({
      workspaceId: workspaceId as string,
      userId,
    });

    res.status(200).json(responseHandler.success(workspace));
  }

  // PATCH: /workspaces/:workspaceId
  static async editWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const userId = req.user.userId;
    const { name } = req.body;
    const workspace = await WorkspaceService.editWorkspace({
      workspaceId: workspaceId as string,
      userId,
      name,
    });
    res.status(200).json(responseHandler.success(workspace));
  }

  // DELETE: /workspaces/:workspaceId
  static async deleteWorkspace(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const userId = req.user.userId;
    const deletedWorkspace = await WorkspaceService.deleteWorkspace({
      userId,
      workspaceId: workspaceId as string,
    });
    res.status(200).json(responseHandler.success(deletedWorkspace));
  }

  // ========================== WORKSPACE MEMBER ==========================

  // GET /workspaces/:workspaceId/members
  static async getMembers(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const members = await WorkspaceService.getMembers({ workspaceId });
    res.status(200).json(responseHandler.success(members));
  }

  // PATCH: /workspaces/:workspaceId/members
  static async addMember(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const { email, role } = req.body;
    const member = await WorkspaceService.addMember({
      workspaceId,
      email,
      role,
    });

    res.status(201).json(responseHandler.success(member));
  }

  // PATCH /workspaces/:workspaceId/members/:memberId
  static async editMember(req: Request, res: Response) {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    const member = await WorkspaceService.editMember({
      workspaceId: workspaceId as string,
      userId: memberId as string,
      role,
    });

    res.status(200).json(responseHandler.success(member));
  }

  // DELETE /workspaces/:workspaceId/members/:memberId
  static async deleteMember(req: Request, res: Response) {
    const { workspaceId, memberId } = req.params;

    const data = await WorkspaceService.deleteMember({
      workspaceId: workspaceId as string,
      userId: memberId as string,
    });

    res.status(200).json(responseHandler.success(data));
  }

  // ========================== BOARD ==========================

  // GET /workspaces/:workspaceId/boards
  static async getBoards(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const { limit } = req.query
    const boards = await WorkspaceService.getBoards({ workspaceId, limit: Number(limit) });

    res.status(200).json(responseHandler.success(boards));
  }

  // POST /workspaces/:workspaceId/boards
  static async createBoard(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const { name, visibility, background } = req.body;

    const board = await WorkspaceService.createBoard({
      workspaceId,
      name,
      visibility,
      background,
      userId: req.user.userId,
    });

    await ActivityService.logActivity({
      boardId: board.id,
      userId: req.user.userId,
      action: "BOARD_CREATED",
      description: `created board "${name}"`,
    });

    res.status(201).json(responseHandler.success(board));
  }

  // PATCH /workspaces/:workspaceId/boards/reorder
  static async reorder(req: Request, res: Response) {
    const { workspaceId } = req.params;
    const { boardId, beforeId, afterId } = req.body;

    if (!workspaceId || !boardId) {
      throw new AppError("Workspace id and board id are required", 400);
    }

    const board = await WorkspaceService.reorderBoard({
      workspaceId: workspaceId as string,
      boardId,
      beforeId,
      afterId,
    });

    res.status(200).json(responseHandler.success(board));
  }

  // ========================== TIMELINE ==========================

  // GET /workspaces/:workspaceId/timeline
  static async getTimeline(req: Request, res: Response) {
    const workspaceId = req.params.workspaceId as string;
    const timeline = await WorkspaceService.getTimeline({ workspaceId });
    res.status(200).json(responseHandler.success(timeline));
  }
}
