import {
  createBoardListApi,
  getBoardApi,
  getBoardListsApi,
  reorderListsApi,
  deleteBoardApi,
} from "./board.api";

export default class BoardService {
  static async getBoard(boardId: string) {
    const response = await getBoardApi(boardId);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async getBoardList(boardId: string) {
    const response = await getBoardListsApi(boardId);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }

  static async createList(payload: { boardId: string; name: string }) {
    const response = await createBoardListApi(payload.boardId, payload.name);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async reorderList(
    boardId: string,
    payload: { listId: string; beforeId?: string | null; afterId?: string | null }
  ) {
    const response = await reorderListsApi(boardId, payload);
    if (!response || !response.success || !response.data) {
      return null;
    }
    return response.data;
  }

  static async deleteBoard(boardId: string) {
    const response = await deleteBoardApi(boardId);
    if (!response || !response.success) {
      return false;
    }
    return true;
  }
}
