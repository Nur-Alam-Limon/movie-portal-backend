import prisma from "../../config/client";
import { Prisma } from '@prisma/client';

const movieIncludes = {
  reviews: {
    where: { approved: true },
    select: {
      rating: true,
      Comment: {
        include: {
          user: true,
        },
      },
      ReviewLike: {
        include: {
          user: true,
        },
      },
    },
  },  
  Watchlist: true,
  Transaction: true,
  MovieAccess: true,
};

// Helper to enrich movies with average rating & review count
const enrichMoviesWithRatings = (movies: any[]) => {
  return movies.map((m) => {
    const ratings = m.reviews.map((r: any) => r.rating);
    const averageRating = ratings.length
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0;

    return {
      ...m,
      rating: averageRating,
      reviewCount: ratings.length,
    };
  });
};

// Create
export const createMovieService = async (data: any) => {
  const movie = await prisma.movie.create({ data, include: movieIncludes });
  return enrichMoviesWithRatings([movie])[0];
};

// Get all
export const getAllMoviesService = async () => {
  const movies = await prisma.movie.findMany({ include: movieIncludes });
  return enrichMoviesWithRatings(movies);
};

// Get by ID
export const getMoviesByIdService = async (id: any) => {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: movieIncludes,
  });
  return movie ? enrichMoviesWithRatings([movie])[0] : null;
};

// Update
export const updateMovieService = async (id: any, data: any) => {
  const movie = await prisma.movie.update({
    where: { id },
    data,
    include: movieIncludes,
  });
  return enrichMoviesWithRatings([movie])[0];
};

// Delete
export const deleteMovieService = async (id: any) => {
  const movie = await prisma.movie.delete({
    where: { id },
    include: movieIncludes,
  });
  return enrichMoviesWithRatings([movie])[0];
};

// Search
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
    include: movieIncludes,
  });

  const enriched = enrichMoviesWithRatings(movies);

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
