import api from "@/api/api";

export default class WorkspaceApi {
  
  // GET: /workspaces
  static async getWorkspaces() {
    try {
      const response = await api.get("/workspaces");
      return response.data; 
    } catch (error) {
      console.error("Lỗi getWorkspaces:", error);
      throw error;
    }
  }

  // POST: /workspaces
  static async createWorkspace(name: string) {
    try {
      const response = await api.post("/workspaces", { name });
      return response.data;
    } catch (error) {
      console.error("Lỗi createWorkspace:", error);
      throw error;
    }
  }

  // DELETE: /workspaces/:workspaceId
  static async deleteWorkspace(workspaceId: string) {
    try {
      const response = await api.delete(`/workspaces/${workspaceId}`);
      // Backend của bạn trả về { message, success: true }
      return response.data;
    } catch (error) {
      console.error("Lỗi deleteWorkspace:", error);
      throw error;
    }
  }

  // GET: /workspaces/:workspaceId/boards
  static async getBoards(workspaceId: string) {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/boards`);
      return response.data;
    } catch (error) {
      console.error("Lỗi getBoards:", error);
      throw error;
    }
  }

  // POST: /workspaces/:workspaceId/boards
  static async createBoard(workspaceId: string, boardData: { title: string, visibility: string, background?: string }) {
    try {
      const response = await api.post(`/workspaces/${workspaceId}/boards`, boardData);
      return response.data;
    } catch (error) {
      console.error("Lỗi createBoard:", error);
      throw error;
    }
  }
}