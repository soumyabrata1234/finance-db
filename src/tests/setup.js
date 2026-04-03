

require("dotenv").config();
const mongoose = require("mongoose");

jest.setTimeout(30000); // 30 seconds — Atlas needs more time than localhost

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});