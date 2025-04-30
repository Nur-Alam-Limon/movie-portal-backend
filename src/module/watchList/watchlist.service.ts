import prisma from "../../config/client";


export const toggleWatchlistService = async (userId: any, movieId: any) => {
  const existing = await prisma.watchlist.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
    return { added: false };
  } else {
    await prisma.watchlist.create({ data: { userId, movieId } });
    return { added: true };
  }
};

export const getMyWatchlistService = (userId: any) => {
  return prisma.watchlist.findMany({
    where: { userId },
    include: { movie: true },
  });
};
