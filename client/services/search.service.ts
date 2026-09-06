import { searchApi } from "@/api/search.api";
import { SearchResult } from "@/types/types";

export default class SearchService {
  static async search(query: string): Promise<SearchResult> {
    const res = await searchApi(query);
    if (res.success && res.data) {
      return res.data;
    }
    return { workspaces: [], boards: [], cards: [] };
  }
}
