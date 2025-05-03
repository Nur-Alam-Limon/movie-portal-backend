import prisma from "../../config/client";

export const getDashboardStatsService = async () => {
  const [
    pendingReviews,
    approvedReviews,
    movies,
    users,
    reviewLikes,
    comments,
    watchlists,
    transactions,
    movieAccess,
  ] = await Promise.all([
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
          select: { rating: true },
        },
      },
    }),
    prisma.user.findMany({
      include: {
        Review: true,
      },
    }),
    prisma.reviewLike.findMany(),
    prisma.comment.findMany(),
    prisma.watchlist.findMany(),
    prisma.transaction.findMany(),
    prisma.movieAccess.findMany(),
  ]);

  // Total user and role stats
  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
  };

  // Genre breakdown
  const genreCount: Record<string, number> = {};
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  // Average rating per movie
  const ratingStats = movies.map((movie) => {
    const ratings = movie.reviews.map((r) => r.rating);
    const averageRating = ratings.length
      ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : null;

    return {
      movieId: movie.id,
      title: movie.title,
      averageRating,
      totalReviews: ratings.length,
    };
  });

  // Most active users
  const activeUsers = users
    .map((u) => ({
      userId: u.id,
      email: u.email,
      reviewCount: u.Review.length,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 10);

  // Most liked reviews
  const reviewLikeCountMap: Record<number, number> = {};
  reviewLikes.forEach((like) => {
    reviewLikeCountMap[like.reviewId] = (reviewLikeCountMap[like.reviewId] || 0) + 1;
  });
  const mostLikedReviews = Object.entries(reviewLikeCountMap)
    .map(([reviewId, count]) => ({ reviewId: Number(reviewId), likeCount: count }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 10);

  // Transaction stats
  const transactionStats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "COMPLETED").length,
    failed: transactions.filter((t) => t.status === "FAILED").length,
    pending: transactions.filter((t) => t.status === "PENDING").length,
    cancelled: transactions.filter((t) => t.status === "CANCELLED").length,
    totalRevenue: transactions
      .filter((t) => t.status === "COMPLETED")
      .reduce((sum, t) => sum + t.totalAmount, 0),
    buyRevenue: transactions
      .filter((t) => t.status === "COMPLETED" && t.type === "BUY")
      .reduce((sum, t) => sum + t.totalAmount, 0),
    rentRevenue: transactions
      .filter((t) => t.status === "COMPLETED" && t.type === "RENT")
      .reduce((sum, t) => sum + t.totalAmount, 0),
  };

  return {
    userStats,
    movieStats: {
      total: movies.length,
      genreCount,
    },
    reviewStats: {
      pending: pendingReviews.length,
      approved: approvedReviews.length,
      mostLikedReviews,
    },
    commentCount: comments.length,
    ratingStats,
    activeUsers,
    transactionStats,
    watchlistCount: watchlists.length,
    accessedMovieCount: movieAccess.length,
  };
};
