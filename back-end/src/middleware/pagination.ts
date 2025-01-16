import type { Request, Response, NextFunction } from "express";
import { type Order } from "../models/order";

const paginatedResults = (serviceFunction: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { filter } = req.query;

    try {
      const { results, totalCount, count } = serviceFunction(
        page,
        limit,
        filter
      );

      const response: PaginatedResponse<Order> = {
        results,
        totalCount,
        count,
      };

      if (page * limit < totalCount) {
        response.next = { page: page + 1, limit };
      }

      if ((page - 1) * limit > 0) {
        response.previous = { page: page - 1, limit };
      }

      res.paginatedResults = response;
      next();
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch paginated results" });
    }
  };
};

interface PaginatedResponse<T> {
  results: T[];
  totalCount: number;
  count: number;
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
}

export { paginatedResults };
