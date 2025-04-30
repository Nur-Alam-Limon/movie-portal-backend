import express from "express";
import { verifyToken } from "../../middleware/jwtToken";
import { createMovie, deleteMovie, getAllMovies, getMoviesById, updateMovie } from "./movie.controller";

const router = express.Router();

router.post("/", verifyToken, createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMoviesById);
router.put("/:id", verifyToken, updateMovie);
router.delete("/:id", verifyToken, deleteMovie);

export default router;
