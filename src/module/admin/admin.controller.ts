import { Request, Response } from "express";
import { getDashboardStatsService } from "./admin.service";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
      const stats = await getDashboardStatsService();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };