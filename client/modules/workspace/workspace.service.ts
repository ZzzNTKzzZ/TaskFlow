import { SymbolColor, SymbolName } from "@/components/icons/SymbolIcon";
import { WorkspaceCard, WorkspaceResponse } from "./workspace";
import {
  getWorkspacesApi,
  getWorkspaceBoardsApi,
  createWorkspaceBoardApi,
  createWorkspaceApi,
  getWorkspaceApi,
  updateWorkspaceApi,
  getWorkspaceMembersApi,
  addWorkspaceMemberApi,
  deleteWorkspaceApi,
  updateWorkspaceMemberRoleApi,
  getWorkspaceTimelineApi,
  TimelineCard,
} from "./workspace.api";
import { RoleWorkspace, Visibility } from "@/types/type";
import { BoardCardUI } from "../board/board";
import { BackgroundColor } from "@/components/illustrations/BackgroundCard";

export default class WorkspaceService {
  static async getWorkspaces(limit?: number): Promise<WorkspaceCard[]> {
    const response = await getWorkspacesApi(limit);

    if (!response || !response.success || !response.data) {
      return [];
    }

    const payload = response.data;

    return payload.map((pa) => ({
      id: pa.id,
      name: pa.name,
      value: pa.slug,
      memberCount: pa.stats.memberCount,
      role: pa.currentUser.role as RoleWorkspace,
      icon: (pa?.icon || "Company") as SymbolName, // Set default Icon
      color: (pa?.color || "Primary") as SymbolColor, // Set default Color
    }));
  }

  static async getWorkspace(id: string): Promise<WorkspaceCard | undefined> {
    const response = await getWorkspaceApi(id);
    if (!response || !response.success || !response.data) {
      return undefined;
    }

    const data = response.data as WorkspaceResponse;

    return {
      id: data.id,
      name: data.name,
      value: data.slug,
      memberCount: data.stats.memberCount,
      role: data.currentUser.role as RoleWorkspace,
      icon: (data.icon || "Company") as SymbolName, // Set default Icon
      color: (data.color || "Primary") as SymbolColor, // Set default Color
    };
  }

  static async createWorkspace(workspaceName: string) {
    const response = await createWorkspaceApi({ name: workspaceName });

    if (!response || !response.data) {
      return [];
    }

    const data = response.data;

    return {
      id: data.id,
      name: data.name,
    };
  }

  static async deleteWorkspace(workspaceId: string) {
     const response = await deleteWorkspaceApi(workspaceId);

    if (!response || !response.data) {
      return [];
    }

    const data = response.data;

    return {
      id: data.id,
      name: data.name,
    };
  }

  static async updateWorkspace(id: string, name: string) {
    const response = await updateWorkspaceApi({ id, name });
    if (!response || !response.data) {
      return [];
    }

    const data = response.data;

    return {
      id: data.id,
      name: data.name,
    };
  }

  static async getWorkspaceBoards(
    workspaceId: string,
    limit?: number,
  ): Promise<BoardCardUI[]> {
    const response = await getWorkspaceBoardsApi(workspaceId, limit);

    if (!response || !response.data) {
      return [];
    }

    const payload = response.data;

    return payload.map((pa) => ({
      id: pa.id,
      name: pa.name,
      memberCount: pa.memberCount,
      cardCount: pa.cardCount,
      listCount: pa.listCount,
      background: (pa.background as BackgroundColor) || "Blue",
    }));
  }

  static async createWorkspaceBoard(payload: {
    workspaceId: string;
    name: string;
    visibility: Visibility;
    background: BackgroundColor;
  }) {
    const response = await createWorkspaceBoardApi(payload);
    if (!response || !response.data) {
      return [];
    }

    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      memberCount: data.memberCount,
      cardCount: data.cardCount,
      listCount: data.listCount,
      background: (data.background as BackgroundColor) || "Blue",
    };
  }

  static async getWorkspaceMembers(workspaceId: string) {
    const response = await getWorkspaceMembersApi(workspaceId);
    if (!response || !response.data) {
      return [];
    }

    const data = response.data;
    return data;
  }

  static async addWorkspaceMember(workspaceId: string, email: string) {
    const response = await addWorkspaceMemberApi(workspaceId, email, "MEMBER");
    if (!response || !response.data) {
      return [];
    }

    const data = response.data;
    return data;
  }

  static async updateWorkspaceMemberRole(workspaceId: string, memberId: string, role: string) {
    const response = await updateWorkspaceMemberRoleApi(workspaceId, memberId, role as any);
    if (!response || !response.data) {
      return null;
    }

    const data = response.data;
    return data;
  }

  static async getWorkspaceTimeline(workspaceId: string): Promise<TimelineCard[]> {
    const response = await getWorkspaceTimelineApi(workspaceId);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }
}
