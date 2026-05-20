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

export const getWorkspaceBoardsApi = async(workspaceId: string, limit?: number):Promise<ResponseApi<BoardResponse[]>> => {
  try {
    const response = await api.get<ResponseApi<BoardResponse[]>>(`/workspaces/${workspaceId}/boards?`, {
      params: {limit}
    })
    return response.data
  } catch (error) {
    console.error("API Error [getWorkspaceBoardsApi]:", error)
    return { success: false, data: []}
  }
}

export const createWorkspaceApi = async(data: Partial<WorkspaceResponse> = {}) => {
  try {
    const response = await api.post<ResponseApi<WorkspaceResponse>>("/workspaces", data);
    return response.data;
  } catch (error) {
    console.error("API Error [createWorkspaceApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
  }
}

export const createWorkspaceBoardApi = async(data: Partial<BoardResponse> = {}) => {
  try {
    console.log(data)
    const respone = await api.post<ResponseApi<BoardResponse>>(`/workspaces/${data.workspaceId}/boards`, {

      name: data.name,
      visibility: data.visibility,
      background: data.background
    })
    return respone.data
  } catch (error) {
     console.error("API Error [createWorkspaceBoardApi]:", error);
    return { success: false } as unknown as ResponseApi<BoardResponse>;
  }
}