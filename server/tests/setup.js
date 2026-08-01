import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connects to a dedicated test database before the suite runs, and
// disconnects afterward. Uses MONGO_URI_TEST if provided, otherwise
// falls back to a local test DB so `npm test` works out of the box.
beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || "mongodb://127.0.0.1:27017/focustrack_test";
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
