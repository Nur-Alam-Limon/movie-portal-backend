import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './module/auth/auth.route'

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to Movie Portal Backend!',
      endpoints: {
        auth: '/api/auth',
      },
    });
  });
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
