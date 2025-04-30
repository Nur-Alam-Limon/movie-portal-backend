import prisma from "../../config/client";
import { Prisma } from '@prisma/client';

export const createMovieService = (data: any) => prisma.movie.create({ data });
export const getAllMoviesService = () => prisma.movie.findMany();
export const getMoviesByIdService = (id: any) => prisma.movie.findUnique({ where: { id } });
export const updateMovieService = (id: any, data: any) => prisma.movie.update({ where: { id }, data });
export const deleteMovieService = (id: any) => prisma.movie.delete({ where: { id } });

export const searchMoviesService = async (query: any) => {
  const {
    title,
    genre,
    director,
    cast,
    platform,
    year,
    minRating,
    maxRating,
    sort,
  } = query;

  const filters: Prisma.MovieWhereInput[] = [];

  if (title) {
    filters.push({
      title: {
        contains: title,
        mode: 'insensitive',
      },
    });
  }

  if (genre) {
    filters.push({
      genres: {
        has: genre,
      },
    });
  }

  if (director) {
    filters.push({
      director: {
        contains: director,
        mode: 'insensitive',
      },
    });
  }

  if (cast) {
    filters.push({
      cast: {
        has: cast,
      },
    });
  }

  if (platform) {
    filters.push({
      streamingLinks: {
        has: platform,
      },
    });
  }

  if (year) {
    filters.push({
      releaseYear: Number(year),
    });
  }

  const where: Prisma.MovieWhereInput = filters.length > 0 ? { AND: filters } : {};

  const movies = await prisma.movie.findMany({
    where,
    include: {
      reviews: {
        where: { approved: true },
        select: { rating: true },
      },
    },
  });

  // Enrich with rating data
  const enriched = movies.map((m) => {
    const ratings = m.reviews.map((r) => r.rating);
    const averageRating = ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    return {
      ...m,
      rating: averageRating,
      reviewCount: ratings.length,
    };
  });

  // Filter by rating range
  const filtered = enriched.filter((m) => {
    if (minRating && m.rating < Number(minRating)) return false;
    if (maxRating && m.rating > Number(maxRating)) return false;
    return true;
  });

  // Sort
  const sorted = filtered.sort((a, b) => {
    switch (sort) {
      case 'ratingDesc':
        return b.rating - a.rating;
      case 'ratingAsc':
        return a.rating - b.rating;
      case 'reviewCountDesc':
        return b.reviewCount - a.reviewCount;
      case 'latest':
        return b.releaseYear - a.releaseYear;
      case 'oldest':
        return a.releaseYear - b.releaseYear;
      default:
        return 0;
    }
  });

  return sorted;
};


