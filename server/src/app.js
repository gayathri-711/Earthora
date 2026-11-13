import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

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

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '4mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    platform: 'EARTHORA',
    tagline: 'Rooted in Nature. Driven by Innovation.',
    status: 'healthy',
  });
});

app.use('/api/v1', apiLimiter);
app.get('/api/v1/dashboard/smart', getSmartDashboard);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', catalogRoutes);
app.use('/api/v1', cartWishlistRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/soil', soilRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/experts', expertRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/farmer', farmerRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1', contentRoutes);

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
