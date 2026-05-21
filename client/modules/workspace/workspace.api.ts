import { api } from "@/services/api";
import { ResponseApi } from "@/types/api";
import { WorkspaceMemberRespone, WorkspaceResponse } from "./workspace";
import { BoardResponse } from "../board/board";
import { RoleWorkspace } from "@/types/type";

export const getWorkspacesApi = async (
  limit?: number,
): Promise<ResponseApi<WorkspaceResponse[]>> => {
  try {
    const response = await api.get<ResponseApi<WorkspaceResponse[]>>(
      `/workspaces`,
      {
        params: { limit },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceApi]:", error);
    return { success: false, data: [] };
  }
};

export const getWorkspaceApi = async (
  id: string,
): Promise<ResponseApi<WorkspaceResponse>> => {
  try {
    const respone = await api.get<ResponseApi<WorkspaceResponse>>(
      `/workspaces/${id}`,
    );
    return respone.data;
  } catch (error) {
    console.error("API Error [getWorkspaceApi]:", error);
    return { success: false, data: null };
  }
};

export const getWorkspaceBoardsApi = async (
  workspaceId: string,
  limit?: number,
): Promise<ResponseApi<BoardResponse[]>> => {
  try {
    const response = await api.get<ResponseApi<BoardResponse[]>>(
      `/workspaces/${workspaceId}/boards?`,
      {
        params: { limit },
      },
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceBoardsApi]:", error);
    return { success: false, data: [] };
  }
};

export const createWorkspaceApi = async (
  data: Partial<WorkspaceResponse> = {},
) => {
  try {
    const response = await api.post<ResponseApi<WorkspaceResponse>>(
      "/workspaces",
      data,
    );
    return response.data;
  } catch (error) {
    console.error("API Error [createWorkspaceApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
  }
};

export const deleteWorkspaceApi = async (id: string) => {
   try {
    const response = await api.delete<ResponseApi<WorkspaceResponse>>(
      `/workspaces/${id}`,
    );
    return response.data;
  } catch (error) {
    console.error("API Error [deleteWorkspaceApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
  }
}

export const createWorkspaceBoardApi = async (
  data: Partial<BoardResponse> = {},
) => {
  try {
    const respone = await api.post<ResponseApi<BoardResponse>>(
      `/workspaces/${data.workspaceId}/boards`,
      {
        name: data.name,
        visibility: data.visibility,
        background: data.background,
      },
    );
    return respone.data;
  } catch (error) {
    console.error("API Error [createWorkspaceBoardApi]:", error);
    return { success: false } as unknown as ResponseApi<BoardResponse>;
  }
};

export const updateWorkspaceApi = async (
  data: Partial<WorkspaceResponse> = {},
) => {
  try {
    const response = await api.patch<ResponseApi<WorkspaceResponse>>(
      `/workspaces/${data.id}`,
      {
        name: data.name,
      },
    );
    return response.data;
  } catch (error) {
    console.error("API Error [updateWorkspaceApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
  }
};
export const getWorkspaceMembersApi = async (id: string) => {
  try {
    const response = await api.get<ResponseApi<WorkspaceMemberRespone[]>>(
      `/workspaces/${id}/members`,
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceMembersApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone>;
  }
};

export const addWorkspaceMemberApi = async (id: string, email: string, role: RoleWorkspace) => {
    try {
    const response = await api.post<ResponseApi<WorkspaceMemberRespone>>(
      `/workspaces/${id}/members`,
      {
        email,
        role
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error [addWorkspaceMembersApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone>;
  }
}
