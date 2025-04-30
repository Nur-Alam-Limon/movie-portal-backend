import { Request, Response } from "express";
import { toggleLikeService } from "./like.service";

interface RequestWithUser extends Request {
    user?: {
      id: string;
      role?: string
    };
  }

export const toggleLike = async (req: RequestWithUser, res: Response) => {
  try {
    const result = await toggleLikeService(req.params.reviewId, req?.user?.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
