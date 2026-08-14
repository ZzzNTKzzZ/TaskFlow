import {
  getCommentsApi,
  createCommentApi,
  updateCommentApi,
  deleteCommentApi,
} from "@/api/comment.api";
import { Comment } from "@/types/comment";

export default class CommentService {
  static async getComments(boardId: string, cardId: string): Promise<Comment[]> {
    const response = await getCommentsApi(boardId, cardId);
    if (response && response.success) {
      return response.data || [];
    }
    return [];
  }

  static async createComment(boardId: string, cardId: string, content: string): Promise<Comment | null> {
    const response = await createCommentApi(boardId, cardId, content);
    if (response && response.success) {
      return response.data;
    }
    return null;
  }

  static async updateComment(boardId: string, cardId: string, commentId: string, content: string): Promise<Comment | null> {
    const response = await updateCommentApi(boardId, cardId, commentId, content);
    if (response && response.success) {
      return response.data;
    }
    return null;
  }

  static async deleteComment(boardId: string, cardId: string, commentId: string): Promise<boolean> {
    const response = await deleteCommentApi(boardId, cardId, commentId);
    return response?.success ?? false;
  }
}
