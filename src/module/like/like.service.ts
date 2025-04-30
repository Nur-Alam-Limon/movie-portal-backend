import prisma from "../../config/client";


export const toggleLikeService = async (reviewId: any, userId: any) => {
  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId: parseInt(reviewId) } },
  });

  if (existing) {
    await prisma.reviewLike.delete({ where: { id: existing.id } });
    return { liked: false };
  } else {
    await prisma.reviewLike.create({ data: { userId, reviewId: parseInt(reviewId) } });
    return { liked: true };
  }
};
