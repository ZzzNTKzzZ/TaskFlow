import type { Request, Response } from "express";
import { SearchService } from "../services/search.service.js";
import { responseHandler } from "../utils/responseHandler.js";

export default class SearchController {
  // GET /search?q=keyword
  static async search(req: Request, res: Response) {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const userId = req.user.userId;

    const results = await SearchService.search(userId, query);
    res.status(200).json(responseHandler.success(results));
  }
}
