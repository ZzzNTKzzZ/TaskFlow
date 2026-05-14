import { api } from "@/services/api";
import { ResponseApi } from "@/types/api";
import { WorkspaceResponse } from "./workspace";
import { BoardResponse } from "../board/board";

export const getWorkspacesApi = async (limit?: number): Promise<ResponseApi<WorkspaceResponse[]>> => {
  try {
    const response = await api.get<ResponseApi<WorkspaceResponse[]>>(`/workspaces`, {
      params: {limit}
    });
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceApi]:", error);
    return { success: false, data: [] };
  }
};

export const getWorkspaceBoardApi = async(workspaceId: string, limit: number = 3):Promise<ResponseApi<BoardResponse[]>> => {
  try {
    const response = await api.get<ResponseApi<BoardResponse[]>>(`/workspaces/${workspaceId}/boards?`, {
      params: {limit}
    })
    return response.data
  } catch (error) {
    console.error("API Error [getWorkspaceBoardApi]:", error)
    return { success: false, data: []}
  }
}