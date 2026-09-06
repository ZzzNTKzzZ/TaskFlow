import { api } from "@/services/api";
import { ApiResponse, SearchResult } from "@/types/types";

export const searchApi = async (
  query: string
): Promise<ApiResponse<SearchResult>> => {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    return {
      success: true,
      data: { workspaces: [], boards: [], cards: [] },
    };
  }

  try {
    const response = await api.get<ApiResponse<SearchResult>>("/search", {
      params: { q: trimmed },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [searchApi]:", error);
    return {
      success: false,
      data: { workspaces: [], boards: [], cards: [] },
      message: error.message,
    };
  }
};
