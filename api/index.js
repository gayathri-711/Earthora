import mongoose from 'mongoose';
import app from '../server/src/app.js';
import { connectDatabase } from '../server/src/config/db.js';
import { seedIfEmpty } from '../server/src/seeds/seed.js';
import { ensureFixedAdmin } from '../server/src/config/fixedAdmin.js';

let isInitialized = false;

export default async function handler(req, res) {
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
  return app(req, res);
}
