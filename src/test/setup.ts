import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import axios from "axios";

jest.mock("axios");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  process.env.DATABASE = "appname";
  process.env.ADMIN_PASSWORD = "12345";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  mockClear();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

function mockClear() {
  (axios.get as jest.Mock).mockClear();
  (axios.post as jest.Mock).mockClear();
}