import prisma from "../../config/client";

export const createMovieService = (data: any) => prisma.movie.create({ data });
export const getAllMoviesService = () => prisma.movie.findMany();
export const getMoviesByIdService = (id: any) => prisma.movie.findUnique({ where: { id } });
export const updateMovieService = (id: any, data: any) => prisma.movie.update({ where: { id }, data });
export const deleteMovieService = (id: any) => prisma.movie.delete({ where: { id } });
