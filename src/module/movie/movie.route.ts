import express from "express";
import { authorizeRoles, verifyToken } from "../../middleware/jwtToken";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMoviesById,
  updateMovie,
} from "./movie.controller";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("admin"), createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMoviesById);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateMovie);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteMovie);

export default router;
