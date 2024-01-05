import request from "supertest";
import { app } from "../../../app";

it("can't drop collections if env is production", async () => {
  process.env.NODE_ENV = 'production';
  const response = await request(app).post("/api/auth/drop/collections").expect(200);
  expect(response.body.message).toEqual("You can't perform as of now");
});

it("drop collections if env is development", async () => {
  process.env.NODE_ENV = 'development';
  const response = await request(app).post("/api/auth/drop/collections").expect(200);
  expect(response.body).toHaveProperty("key");
  expect(response.body).toHaveProperty("backup");
  expect(response.body.key.length).toEqual(1);
  expect(response.body.backup.length).toEqual(0);
});