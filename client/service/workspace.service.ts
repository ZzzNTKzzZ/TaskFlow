import api from "@/api/api";

export const getWorkspace = async () => {
  try {
    const response = await api.get("/workspaces/");
    return response.data;
  } catch (error) {
    console.error("Lỗi API getWorkspace:", error);
    throw error;
  }
};

export const createWorkspace = async (workspaceName: string) => {
  try {
    const response = await api.post("/workspaces/", { name: workspaceName });
    return response.data;
  } catch (error) {
    console.error("Lỗi API createWorkspace: ", error);
    throw error;
  }
};

export const deleteWorkspaceApi = async (workspaceId: string) => {
  try {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi deleteWorkspace:", error);
    throw error;
  }
};


export const fetchWorkspaceData = async () => {
  try {
    return await getWorkspace();
  } catch (error) {
    throw error;
  }
};