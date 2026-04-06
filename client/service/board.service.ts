import api from "@/api/api";

export const getBoardByWorkspaceIdApi = async (workspaceId: string) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/boards`);
    return response.data;
  } catch (error) {
    console.error("Lỗi getBoardByWorkspaceIdApi:", error);
    throw error;
  }
};


export const createBoardApi = async (
  workspaceId: string,
  title: string,
  visibility: string,
  background?: string | null
) => {
  try {
    console.log("Đang tạo Board:", title);
    const response = await api.post(`/workspaces/${workspaceId}/boards`, {
      title,
      visibility,
      background,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi createBoardApi:", error);
    throw error;
  }
};


export const deleteBoardApi = async (boardId: string) => {
  try {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi deleteBoardApi:", error);
    throw error;
  }
};