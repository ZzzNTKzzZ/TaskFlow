import api from "@/api/api"
export const getBoardByWorkspaceIdApi = async (workspaceId: string) => {
    try {
        const response = await api.get(`/workspaces/${workspaceId}/boards`);
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createBoardApi = async (workspaceId: string, title: string, visibility: string, background: string, userId: string) => {
    try {
        console.log("Đang tạo Board:", title);
        const response = await api.post(`/workspaces/${workspaceId}/boards`, { title, visibility, background, userId });
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteBoardApi = async (boardId: string) => {
    try {
        const response = await api.delete(`/boards/${boardId}`);
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}