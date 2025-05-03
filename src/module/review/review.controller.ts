import { Request, Response } from "express";
import { createReviewService, deleteReviewService, getAllReviewsService, getUserReviewsService, toggleApprovalReviewService, updateReviewService } from "./review.service";

interface RequestWithUser extends Request {
    user?: {
      id: string;
    };
  }

export const createReview = async (req: RequestWithUser, res: Response) => {
  try {
    const review = await createReviewService({
      ...req.body,
      userId: req?.user?.id,
    });
    res.status(201).json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateReview = async (req: RequestWithUser, res: Response) => {
  try {
    const review = await updateReviewService(req.params.id, req?.user?.id, req.body);
    res.json(review);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export const deleteReview = async (req: RequestWithUser, res: Response) => {
  try {
    await deleteReviewService(req.params.id, req?.user?.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export const toggleApproval = async (req: Request, res: Response) => {
  try {
    const review = await toggleApprovalReviewService(req.params.id);
    res.json(review);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserReviews = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const reviews = await getUserReviewsService(userId);
    res.status(200).json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviewsService();
    res.status(200).json(reviews);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
