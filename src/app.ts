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
import adminRoutes from './module/admin/admin.route'
import paymentRoutes from './module/payment/payment.route'

const app = express();

const allowedOrigins = [
  `${process.env.FRONTEND_URL}`,
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
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
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)

app.use(notFound);
app.use(errorHandler);

export default app;
