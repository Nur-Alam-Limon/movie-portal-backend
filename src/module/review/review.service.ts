import prisma from "../../config/client";


export const createReviewService = (data: any) => {
  return prisma.review.create({
    data,
  });
};

export const updateReviewService = async (reviewId: any, userId: any, data: any) => {
  const review = await prisma.review.findUnique({ where: { id: parseInt(reviewId) } });
  if (!review || review.userId !== userId || review.approved)
    throw new Error('Not allowed to update this review');

  return prisma.review.update({
    where: { id: parseInt(reviewId) },
    data,
  });
};

export const deleteReviewService = async (reviewId: any, userId: any) => {
  const review = await prisma.review.findUnique({ where: { id: parseInt(reviewId) } });
  if (!review || review.userId !== userId || review.approved)
    throw new Error('Not allowed to delete this review');

  return prisma.review.delete({
    where: { id: parseInt(reviewId) },
  });
};

export const toggleApprovalReviewService = async (reviewId: any) => {
  const review = await prisma.review.findUnique({ where: { id: parseInt(reviewId) } });
  if (!review) throw new Error('Review not found');

  return prisma.review.update({
    where: { id: parseInt(reviewId) },
    data: { approved: !review.approved },
  });
};

export const getUserReviewsService = async (userId: string) => {

  return prisma.review.findMany({
    where: { userId: parseInt(userId) },
    include: {
      movie: true,
      ReviewLike: true,
      Comment: {
        include: {
          user: true,
          replies: {
            include: { user: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const getAllReviewsService = async () => {
  return prisma.review.findMany({
    // where: { approved: true },
    include: {
      movie: true,
      user: true,
      ReviewLike: true,
      Comment: {
        include: {
          user: true,
          replies: {
            include: { user: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

