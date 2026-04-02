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