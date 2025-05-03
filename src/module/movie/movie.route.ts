import express from "express";
import { authorizeRoles, verifyToken } from "../../middleware/jwtToken";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMoviesById,
  searchMovies,
  updateMovie,
} from "./movie.controller";

const router = express.Router();

router.get('/search', searchMovies);
router.get("/:id", getMoviesById);
router.post("/", verifyToken, authorizeRoles("admin"), createMovie);
router.get("/", getAllMovies);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateMovie);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteMovie);


export default router;
