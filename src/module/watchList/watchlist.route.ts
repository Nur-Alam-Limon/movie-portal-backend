import express from "express";
import { verifyToken } from "../../middleware/jwtToken";
import { getMyWatchlist, toggleWatchlist } from "./watchlist.controller";

const router = express.Router();

router.post('/:movieId', verifyToken, toggleWatchlist);
router.get('/', verifyToken, getMyWatchlist);

export default router;
