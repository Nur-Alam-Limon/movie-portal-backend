import { Request, Response } from "express";
import { createMovieService, deleteMovieService, getAllMoviesService, getMoviesByIdService, updateMovieService } from "./movie.service";


export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await createMovieService(req.body);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllMovies = async (req: Request, res: Response) => {
  const movies = await getAllMoviesService();
  res.json(movies);
};

export const getMoviesById = async (req: Request, res: Response) => {
  const movie = await getMoviesByIdService(parseInt(req.params.id));
  if (!movie) {res.status(404).json({ message: 'Movie not found' }); return;};
  res.json(movie);
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await updateMovieService(parseInt(req.params.id), req.body);
    res.json(movie);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  await deleteMovieService(parseInt(req.params.id));
  res.status(204).send();
};
