import prisma from "../../config/client";

export const getDashboardStatsService = async () => {
  const [pendingReviews, publishedReviews, movies, users] = await Promise.all([
    prisma.review.findMany({
      where: { approved: false },
      include: { movie: true, user: true },
    }),
    prisma.review.findMany({
      where: { approved: true },
      include: { movie: true, user: true },
    }),
    prisma.movie.findMany({
      include: {
        reviews: {
          where: { approved: true },
          select: { rating: true },
        },
      },
    }),
    prisma.user.findMany({
      include: {
        Review: {
          where: { approved: true },
          select: { id: true }, // minimal fields needed to count
        },
      },
    }),
  ]);

  // Average rating per movie
  const ratingStats = movies.map((movie) => {
    const ratings = movie.reviews.map((r) => r.rating);
    const averageRating = ratings.length
      ? parseFloat(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        )
      : null;

    return {
      movieId: movie.id,
      title: movie.title,
      averageRating,
      totalReviews: ratings.length,
    };
  });

  // Most active users by approved reviews
  const activeUsers = users
    .map((u) => ({
      userId: u.id,
      email: u.email,
      reviewCount: u.Review.length,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 10); // top 10

  return {
    pendingReviews,
    publishedReviewCount: publishedReviews.length,
    ratingStats,
    activeUsers,
  };
};
