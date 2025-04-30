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
