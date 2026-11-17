import mongoose from 'mongoose';
import app from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/db.js';
import { seedIfEmpty } from '../server/src/seeds/seed.js';
import { ensureFixedAdmin } from '../server/src/config/fixedAdmin.js';

let isInitialized = false;

export default async function handler(req, res) {
  // Normalize incoming request URL for Vercel serverless rewrites
  const forwardedUri = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'];
  if (forwardedUri && forwardedUri.startsWith('/api') && req.url !== forwardedUri) {
    req.url = forwardedUri;
  }
  if (req.url && req.url.startsWith('/v1/')) {
    req.url = '/api' + req.url;
  }

  if (!isInitialized) {
    try {
      await connectDatabase(process.env.MONGO_URI);
      if (mongoose.connection.readyState === 1) {
        await seedIfEmpty();
        await ensureFixedAdmin();
      }
      isInitialized = true;
    } catch (err) {
      console.warn('[Vercel Serverless] DB initialization deferred:', err.message);
      isInitialized = true; // Mark initialized so we don't block serverless execution
    }
  }

  try {
    return app(req, res);
  } catch (err) {
    console.error('[Vercel API Handler Error]:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
      });
    }
  }
}
