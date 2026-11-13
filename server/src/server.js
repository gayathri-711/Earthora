import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { seedIfEmpty } from './seeds/seed.js';

const PORT = Number(process.env.PORT || 5000);

async function start() {
  const { usingMemory } = await connectDatabase(process.env.MONGO_URI);
  await seedIfEmpty();

  app.listen(PORT, '127.0.0.1', () => {
    console.log(
      `AGRIVA API running at http://127.0.0.1:${PORT} (${usingMemory ? 'embedded MongoDB' : 'external MongoDB'})`
    );
  });
}

start().catch((err) => {
  console.error('Failed to start AGRIVA server:', err);
  process.exit(1);
});

