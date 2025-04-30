import express from "express";
import { verifyToken } from "../../middleware/jwtToken";
import { toggleLike } from "./like.controller";

const router = express.Router();

router.post('/:reviewId', verifyToken, toggleLike);

export default router;
