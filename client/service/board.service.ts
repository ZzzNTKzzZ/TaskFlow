import api from "@/api/api";
import { requireNativeComponent } from "react-native";

export const getBoardByWorkspaceIdApi = async (workspaceId: string) => {
  try {
    console.log("workspaceId", workspaceId)
    const response = await api.get(`/workspaces/${workspaceId}/boards`);
    return response.data;
  } catch (error) {
    console.error("Lỗi getBoardByWorkspaceIdApi:", error);
    throw error;
  }
};


export const createBoardApi = async (data: {
  workspaceId: string;
  title: string;
  visibility: string;
  template: "Kanban" | "Scrum Sprint" | "Task List" | "Custom Matrix";
  background?: string | null;
}) => {
  try {
    const { workspaceId, title, visibility, template, background } = data;
    
    const response = await api.post(`/workspaces/${workspaceId}/boards`, {
      title,
      visibility,
      background,
    });

    const boardId = response.data.id;

    let listNames: string[] = [];
    switch (template) {
      case "Kanban":
        listNames = ["To do", "Doing", "Done"];
        break;
      case "Scrum Sprint":
        listNames = ["Backlog", "Sprint Planning", "In Progress", "Review", "Done"];
        break;
      case "Task List":
        listNames = ["New", "In Review", "Completed"];
        break;
      case "Custom Matrix":
        listNames = []; // Tùy chỉnh thêm
        break;
      default:
        listNames = ["To do", "Doing", "Done"];
    }
    for (const name of listNames) {
      await createListApi({ boardId, title: name });
    }

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

export const getListsApi = async(data: {boardId: string}) => {
  try {
    const { boardId } = data
    const response = await api.get(`/boards/${boardId}/lists`)
    console.log(response.data)
    return response.data
  } catch (error) {
    
  }
}

export const createListApi = async (data:{boardId: string, title: string}) => {
  try {
    const { boardId, title} = data
    const response = await api.post(`/boards/${boardId}/lists`,{title} )
    return response.data
  } catch (error) {
    console.error("Lỗi createListApi:", error)
    throw error;
  }
}