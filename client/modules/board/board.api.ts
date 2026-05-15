import { api } from "@/services/api";
import { ResponseApi } from "@/types/api";

export const getBoard = async (boardId: string) => {
    try {
        const respone = await api.get(`/boards/${boardId}`)
        console.log(respone)
        return respone.data
    } catch (error) {
         console.error("API Error [getWorkspaceApi]:", error);
    return { success: false, data: [] };
    }
}