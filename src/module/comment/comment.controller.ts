import { Request, Response } from "express";
import { createCommentService, getByCommentService } from "./comment.service";

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role?: string
  };
}

export const addComment = async (req: RequestWithUser, res: Response) => {
  try {
    const comment = await createCommentService({
      ...req.body,
      userId: req?.user?.id,
    });
    res.status(201).json(comment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await getByCommentService(req.params.reviewId);
    res.json(comments);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
