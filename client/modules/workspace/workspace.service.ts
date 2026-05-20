import { SymbolColor, SymbolName } from "@/components/icons/SymbolIcon";
import { WorkspaceCard } from "./workspace";
import { getWorkspacesApi, getWorkspaceBoardsApi, createWorkspaceBoardApi } from "./workspace.api";
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
      icon: (pa?.icon || "Company") as SymbolName,
      color: (pa?.color || "Primary") as SymbolColor
    }));
  }


  static async getWorkspaceBoards(workspaceId: string, limit?: number): Promise<BoardCardUI[]> {
    const response = await getWorkspaceBoardsApi(workspaceId, limit)

    if(!response || !response.data) {
      return []
    }

    const payload = response.data

    return payload.map((pa) => ({
      id: pa.id,
      name: pa.name,
      memberCount: pa.memberCount,
      cardCount: pa.cardCount,
      listCount: pa.listCount,
      background: pa.background as BackgroundColor || "Blue" 
    }))
  }

  static async createWorkspaceBoard(payload: {workspaceId: string ,name: string, visibility: Visibility, background: BackgroundColor}) {
    console.log(payload)
    const respone = await createWorkspaceBoardApi(payload)
    if(!respone || !respone.data) {
      return []
    }

    const data = respone.data

    return {
      id: data.id,
      name: data.name,
      memberCount: data.memberCount,
      cardCount: data.cardCount,
      listCount: data.listCount,
      background: data.background as BackgroundColor || "Blue" }
}
}