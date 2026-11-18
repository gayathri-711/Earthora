import mongoose from 'mongoose';

// Disable command buffering so calls don't hang if MongoDB connection is pending or unavailable
mongoose.set('bufferCommands', false);

let memoryServer = null;

const ATLAS_PRODUCTION_URI =
  'mongodb+srv://gayatrisenthamarai_db_user:fQCFvIVoc48fKger@cluster0.mx2er0r.mongodb.net/earthora?retryWrites=true&w=majority';

/**
 * Connects to external MONGO_URI if configured, or falls back to an embedded
 * MongoMemoryServer instance for zero-config local execution and testing.
 * On serverless platforms (e.g. Vercel), connects directly to the user's MongoDB Atlas cluster.
 */
export async function connectDatabase(mongoUri) {
  // Reuse existing connection if already connected (vital for serverless container warm executions)
  if (mongoose.connection.readyState === 1) {
    return { uri: mongoUri, usingMemory: false };
  }

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  let uri = mongoUri?.trim() || process.env.MONGO_URI?.trim();
  let usingMemory = false;

  // On Vercel / serverless: automatically connect to MongoDB Atlas cluster
  if (!uri && isServerless) {
    uri = ATLAS_PRODUCTION_URI;
  }

  if (!uri) {
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
