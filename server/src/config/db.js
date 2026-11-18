import mongoose from 'mongoose';

// Disable command buffering so calls don't hang if MongoDB connection is pending or unavailable
mongoose.set('bufferCommands', false);

let memoryServer = null;

/**
 * Connects to external MONGO_URI if configured, or falls back to an embedded
 * MongoMemoryServer instance for zero-config local execution and testing.
 * On serverless platforms (e.g. Vercel), gracefully falls back to in-memory demo mode
 * if MONGO_URI environment variable is not configured.
 */
export async function connectDatabase(mongoUri) {
  // Reuse existing connection if already connected (vital for serverless container warm executions)
  if (mongoose.connection.readyState === 1) {
    return { uri: mongoUri, usingMemory: false };
  }

  let uri = mongoUri?.trim() || process.env.MONGO_URI?.trim();
  let usingMemory = false;

  // On Vercel / serverless: do NOT attempt to spawn MongoMemoryServer binary
  // (which exceeds 50MB limits and crashes or times out in AWS Lambda)
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (!uri) {
    if (isServerless) {
      console.warn('[DB] Running on Vercel without MONGO_URI. Fallback demo mode active. Add MONGO_URI to Vercel Project Settings for permanent database records.');
      return { uri: null, usingMemory: true };
    }

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      usingMemory = true;
    } catch (err) {
      console.warn('[DB] MongoMemoryServer unavailable:', err.message);
      return { uri: null, usingMemory: false };
    }
  }

  if (uri) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      console.log('[DB] Connected successfully to MongoDB:', usingMemory ? 'Embedded In-Memory' : 'Remote MongoDB');
    } catch (err) {
      console.warn('[DB] Mongoose connection attempt failed:', err.message);
    }
  }

  return { uri, usingMemory };
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
