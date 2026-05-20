import { api } from "@/services/api";
import { ResponseApi } from "@/types/api";
import { requireNativeComponent } from "react-native";

export const getBoardApi = async (boardId: string) => {
    try {
        const respone = await api.get(`/boards/${boardId}`)
        return respone.data
    } catch (error) {
         console.error("API Error [getWorkspaceApi]:", error);
    return { success: false, data: [] };
    }
}
export const createBoardListApi = async (boardId: string, name: string) => {
    try {
        const respone = await api.post(`/boards/${boardId}/lists`, {
          name  
        })
        return respone.data

    } catch(error) {
        console.error("API Error [createBoardListApi: ", error)
        return { success: false, data :[]}
    }
}