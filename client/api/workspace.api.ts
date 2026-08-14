import { api } from "@/services/api";
import { ResponseApi } from "@/types/api";
import { WorkspaceMemberRespone, WorkspaceResponse } from "@/types/workspace";
import { BoardResponse } from "@/types/board";
import { WorkspaceRole } from "@/types/types";

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
  if (!id || id === "undefined" || id.startsWith("(")) {
    return { success: false, data: null };
  }
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
  if (!workspaceId || workspaceId === "undefined" || workspaceId.startsWith("(")) {
    return { success: false, data: [] };
  }
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
   if (!id || id === "undefined" || id.startsWith("(")) {
     return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
   }
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
  if (!data.workspaceId || data.workspaceId === "undefined" || data.workspaceId.startsWith("(")) {
    return { success: false } as unknown as ResponseApi<BoardResponse>;
  }
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
  if (!data.id || data.id === "undefined" || data.id.startsWith("(")) {
    return { success: false } as unknown as ResponseApi<WorkspaceResponse>;
  }
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
  if (!id || id === "undefined" || id.startsWith("(")) {
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone[]>;
  }
  try {
    const response = await api.get<ResponseApi<WorkspaceMemberRespone[]>>(
      `/workspaces/${id}/members`,
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceMembersApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone[]>;
  }
};

export const addWorkspaceMemberApi = async (id: string, email: string, role: WorkspaceRole) => {
    if (!id || id === "undefined" || id.startsWith("(")) {
      return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone>;
    }
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

export const updateWorkspaceMemberRoleApi = async (workspaceId: string, memberId: string, role: WorkspaceRole) => {
  if (!workspaceId || workspaceId === "undefined" || workspaceId.startsWith("(") || !memberId || memberId === "undefined" || memberId.startsWith("(")) {
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone>;
  }
  try {
    const response = await api.patch<ResponseApi<WorkspaceMemberRespone>>(
      `/workspaces/${workspaceId}/members/${memberId}`,
      {
        role
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error [updateWorkspaceMemberRoleApi]:", error);
    return { success: false } as unknown as ResponseApi<WorkspaceMemberRespone>;
  }
}

export const removeWorkspaceMemberApi = async (workspaceId: string, memberId: string) => {
  if (!workspaceId || workspaceId === "undefined" || !memberId || memberId === "undefined") {
    return { success: false } as unknown as ResponseApi<{ message: string }>;
  }
  try {
    const response = await api.delete<ResponseApi<{ message: string }>>(
      `/workspaces/${workspaceId}/members/${memberId}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error [removeWorkspaceMemberApi]:", error);
    return { success: false } as unknown as ResponseApi<{ message: string }>;
  }
}

export type TimelineCard = {
  id: string;
  name: string;
  description: string | null;
  priority: string;
  dueDate: string | null;
  createdAt: string;
  listName: string;
  boardId: string;
  boardName: string;
  boardBackground: string | null;
  checklistTotal?: number;
  checklistCompleted?: number;
};

export const getWorkspaceTimelineApi = async (
  workspaceId: string,
): Promise<ResponseApi<TimelineCard[]>> => {
  if (!workspaceId || workspaceId === "undefined" || workspaceId.startsWith("(")) {
    return { success: false, data: [] };
  }
  try {
    const response = await api.get<ResponseApi<TimelineCard[]>>(
      `/workspaces/${workspaceId}/timeline`,
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getWorkspaceTimelineApi]:", error);
    return { success: false, data: [] };
  }
};
