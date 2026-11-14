import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { ensureFixedAdmin } from './config/fixedAdmin.js';
import { seedIfEmpty } from './seeds/seed.js';

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  const { usingMemory } = await connectDatabase(process.env.MONGO_URI);
  await seedIfEmpty();
  await ensureFixedAdmin();

  app.listen(PORT, HOST, () => {
    console.log(
      `EARTHORA Platform running at http://${HOST === '0.0.0.0' ? '127.0.0.1' : HOST}:${PORT} (${usingMemory ? 'embedded MongoDB' : 'external MongoDB'})`
    );
    console.log(`Mobile phone access: Connect to the same Wi-Fi and open http://<YOUR_IP>:${PORT} in any mobile browser.`);
  });
}

start().catch((err) => {
  console.error('Failed to start EARTHORA platform server:', err);
  process.exit(1);
});

