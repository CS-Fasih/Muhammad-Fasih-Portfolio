const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

class DatabaseConfigurationError extends Error {
  constructor() {
    super('MONGODB_URI is not configured.');
    this.name = 'DatabaseConfigurationError';
  }
}

const globalCache = globalThis.__portfolioMongooseCache || {
  connection: null,
  promise: null,
};

globalThis.__portfolioMongooseCache = globalCache;

async function connectDB() {
  if (globalCache.connection?.readyState === 1) {
    return globalCache.connection;
  }

  // A resolved promise can outlive a connection that was explicitly closed
  // by the driver/runtime. Clear both entries so the next invocation can
  // establish a fresh connection instead of reusing a disconnected object.
  if (globalCache.connection?.readyState === 0) {
    globalCache.connection = null;
    globalCache.promise = null;
  }

  if (
    globalCache.connection &&
    ![1, 2].includes(globalCache.connection.readyState)
  ) {
    globalCache.connection = null;
    globalCache.promise = null;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new DatabaseConfigurationError();

  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(uri, {
        maxPoolSize: 5,
        minPoolSize: 0,
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 20_000,
      })
      .then((instance) => instance.connection)
      .catch((error) => {
        globalCache.promise = null;
        throw error;
      });
  }

  globalCache.connection = await globalCache.promise;
  return globalCache.connection;
}

module.exports = { connectDB, DatabaseConfigurationError };
