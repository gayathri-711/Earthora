import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { connectDatabase } from './config/db.js';
import { ensureFixedAdmin } from './config/fixedAdmin.js';
import { seedIfEmpty } from './seeds/seed.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { uploadsDir } from './middleware/uploadMiddleware.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartWishlistRoutes from './routes/cartWishlistRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import soilRoutes from './routes/soilRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { getSmartDashboard } from './controllers/dashboardController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistDir = path.resolve(__dirname, '../../client/dist');

const app = express();

app.set('trust proxy', 1);

// Guarantee req.socket & remoteAddress exist in serverless (e.g. Vercel) environments
app.use((req, _res, next) => {
  if (!req.socket) req.socket = {};
  if (!req.socket.remoteAddress) {
    req.socket.remoteAddress =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      '127.0.0.1';
  }
  next();
});

// Lazy DB initialization middleware (handles serverless cold starts seamlessly)
let isSeeded = false;
app.use(async (_req, _res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err) {
      console.warn('[DB] Connection deferred:', err.message);
    }
  }
  if (mongoose.connection.readyState === 1 && !isSeeded) {
    try {
      await seedIfEmpty();
      await ensureFixedAdmin();
      isSeeded = true;
    } catch (err) {
      console.warn('[DB] Seed warning:', err.message);
    }
  }
  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '4mb' }));

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(uploadsDir));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => {
    return (
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1'
    );
  },
});

app.get(['/api/health', '/health', '/api/v1/health'], (_req, res) => {
  res.json({
    success: true,
    platform: 'EARTHORA',
    tagline: 'Rooted in Nature. Driven by Innovation.',
    status: 'healthy',
  });
});

app.use((req, _res, next) => {
  if (req.url.startsWith('/v1/')) {
    req.url = '/api' + req.url;
  }
  next();
});

const mountApiRoutes = (prefix) => {
  app.use(prefix || '/', apiLimiter);
  app.get(`${prefix}/dashboard/smart`, getSmartDashboard);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(prefix || '/', catalogRoutes);
  app.use(prefix || '/', cartWishlistRoutes);
  app.use(`${prefix}/crops`, cropRoutes);
  app.use(`${prefix}/soil`, soilRoutes);
  app.use(`${prefix}/weather`, weatherRoutes);
  app.use(`${prefix}/experts`, expertRoutes);
  app.use(`${prefix}/knowledge`, knowledgeRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/farmer`, farmerRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/content`, contentRoutes);
  app.use(`${prefix}/ai`, aiRoutes);
};

mountApiRoutes('/api/v1');
mountApiRoutes('/api');
mountApiRoutes('/v1');
mountApiRoutes('');

if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistDir, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
