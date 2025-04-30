import prisma from "../../config/client";


export const createCommentService = (data: any) => {
  return prisma.comment.create({ data });
};

export const getByCommentService = (reviewId: any) => {
  return prisma.comment.findMany({
    where: { reviewId: parseInt(reviewId), parentId: null },
    include: {
      replies: {
        include: { user: true },
      },
      user: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};
