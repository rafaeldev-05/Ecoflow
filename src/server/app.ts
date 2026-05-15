import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

import { errorMiddleware } from './middlewares/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { collectionsRoutes } from './routes/collections.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { environmentalMetricsRoutes } from './routes/environmental-metrics.routes';
import { healthRoutes } from './routes/health.routes';
import { materialsRoutes } from './routes/materials.routes';
import { usersRoutes } from './routes/users.routes';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:3000',
  process.env.CORS_ORIGIN,
].filter(Boolean);

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  },
};

export const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/environmental-metrics', environmentalMetricsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);

app.use(errorMiddleware);
