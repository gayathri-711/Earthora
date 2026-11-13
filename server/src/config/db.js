import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

/**
 * Connects to external MONGO_URI if configured, or falls back to an embedded
 * MongoMemoryServer instance for zero-config local execution and testing.
 */
export async function connectDatabase(mongoUri) {
  let uri = mongoUri?.trim();
  let usingMemory = false;

  if (!uri) {
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    usingMemory = true;
  }

  await mongoose.connect(uri);
  return { uri, usingMemory };
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

