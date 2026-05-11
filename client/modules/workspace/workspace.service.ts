import { SymbolColor, SymbolName } from "@/components/icons/SymbolIcon";
import { WorkspaceCard } from "./workspace";
import { getWorkspaceApi, getWorkspaceBoardApi } from "./workspace.api";
import { RoleWorkspace } from "@/types/type";
import { BoardCardUI } from "../board/board";
import { BackgroundColor } from "@/components/illustrations/BackgroundCard";

export default class WorkspaceService {
  static async getWorkspaces(limit?: number): Promise<WorkspaceCard[]> {
    const response = await getWorkspaceApi(limit);

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
      icon: (pa?.icon || "Company") as SymbolName,
      color: (pa?.color || "Primary") as SymbolColor
    }));
  }

  static async getWorkspaceBoard(workspaceId: string): Promise<BoardCardUI[]> {
    const response = await getWorkspaceBoardApi(workspaceId)

    if(!response || !response.data) {
      return []
    }

    const payload = response.data

    return payload.map((pa) => ({
      id: pa.id,
      name: pa.name,
      memberCount: pa.memberCount,
      background: pa.background as BackgroundColor || "Blue" 
    }))
  }
}