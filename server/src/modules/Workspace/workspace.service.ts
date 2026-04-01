import type { BoardVisibility, WorkspaceRole } from "../../../generated/prisma/index.js";
import slugify from "../../helper/slugify.helper.js";
import { AppError } from "../../utils/appError.js";
import WorkspaceRepository from "./workspace.repository.js";

export class WorkspaceService {
  static async getUserWorkspaces(userId: string) {
    const workspaces = await WorkspaceRepository.findUserWorkspaces(userId);
    return workspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      createdAt: ws.createdAt,
      role: ws.members[0]?.role,
      memberCount: ws._count.members,
    }));
  }
  static async createWorkSpace(userId: string, name: string) {
    const baseSlug = slugify(name);
    const shortId = userId.slice(-8);
    const slug = `${baseSlug}-${shortId}`;

    const workspace = await WorkspaceRepository.createWorkspace(
      userId,
      name,
      slug,
    );

    return workspace;
  }
  static async getWorkspace(workspaceId: string) {
    const workspace = await WorkspaceRepository.findWorkspace(workspaceId);
    return workspace;
  }

  static async editWorkspace(workspaceId: string, name: string) {
    const slug = slugify(name);
    const workspace = await WorkspaceRepository.updateWorkspace(
      workspaceId,
      name,
      slug,
    );

    return workspace;
  }

  static async deleteWorkspace(workspaceId: string) {
    const workspace = await WorkspaceRepository.findWorkspace(workspaceId);
    if (!workspace) throw new AppError("Workspace not found", 400);
    await WorkspaceRepository.deleteWorkspace(workspaceId);
    return { message: "Workspace deleted" };
  }

  // ========================== WORKSPACE MEMBER ==========================

  static async getMembers(workspaceId: string) {
    const members = await WorkspaceRepository.findMembers(workspaceId);
    return { members };
  }

  static async addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ) {
    const workspace = await WorkspaceRepository.findWorkspace(workspaceId);
    if (!workspace) throw new AppError("Workspace not found", 404);
    const existing = await WorkspaceRepository.findMember(workspaceId, userId);
    if (existing) throw new AppError("User already a member", 409);
    const member = await WorkspaceRepository.addMember(
      workspaceId,
      userId,
      role,
    );
    return member;
  }

  static async editMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceRole,
  ) {
    const existing = await WorkspaceRepository.findMember(workspaceId, userId);
    if (!existing) throw new AppError("Member not found", 404);

    const member = await WorkspaceRepository.updateMember(
      workspaceId,
      userId,
      role,
    );
    return member;
  }

  static async deleteMember(workspaceId: string, userId: string) {
    const existing = await WorkspaceRepository.findMember(workspaceId, userId);
    if (!existing) throw new AppError("User not found", 404);

    await WorkspaceRepository.deleteMember(workspaceId, userId);

    return { message: "Member removed" };
  }

  static async getBoards(workspaceId: string) {
    const boards = await WorkspaceRepository.findBoards(workspaceId);
    return boards ;
  }

  static async createBoard(
    workspaceId: string,
    title: string,
    visibility: BoardVisibility,
    background: string,
    userId: string
  ) {
    const existing = await WorkspaceRepository.findWorkspace(workspaceId)
    if(!existing) throw new AppError("Board not found", 404)

    const board = await WorkspaceRepository.createBoard(workspaceId, title, visibility, background, userId)
    return board
  }
  
}
