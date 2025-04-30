import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './module/auth/auth.route'
import movieRoutes from './module/movie/movie.route'
import reviewRoutes from './module/review/review.route'
import likeRoutes from './module/like/like.route'
import commentRoutes from './module/comment/comment.route'
import watchlistRoutes from './module/watchList/watchlist.route'

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to Movie Portal Backend!',
      endpoints: {
        movies: '/api/movies',
        reviews: '/api/reviews'
      },
    });
  });
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
