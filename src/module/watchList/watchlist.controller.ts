import { Request, Response } from "express";
import { getMyWatchlistService, toggleWatchlistService } from "./watchlist.service";

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role?: string
  };
}

export const toggleWatchlist = async (req: RequestWithUser, res: Response) => {
  try {
    const result = await toggleWatchlistService(req?.user?.id, parseInt(req.params.movieId));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyWatchlist = async (req: RequestWithUser, res: Response) => {
  try {
    const items = await getMyWatchlistService(req?.user?.id);
    res.json(items);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
