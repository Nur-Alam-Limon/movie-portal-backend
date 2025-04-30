import express from "express";
import { verifyToken } from "../../middleware/jwtToken";
import { addComment, getComments } from "./comment.controller";

const router = express.Router();

router.post('/', verifyToken, addComment);
router.get('/:reviewId', getComments);


export default router;