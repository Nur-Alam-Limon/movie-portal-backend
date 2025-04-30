import express from "express";
import { authorizeRoles, verifyToken } from "../../middleware/jwtToken";
import { createReview, deleteReview, toggleApproval, updateReview } from "./review.controller";

const router = express.Router();

// User routes
router.post('/', verifyToken, createReview);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

// Admin-only approval toggle
router.patch('/:id/approve', verifyToken, authorizeRoles('admin'), toggleApproval);

export default router;
