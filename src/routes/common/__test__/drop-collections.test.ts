import request from "supertest";
import { app } from "../../../app";

it("can't drop collections if env is production", async () => {
  process.env.NODE_ENV = 'production';
  const response = await request(app).post("/api/common/drop/collections").expect(200);
  expect(response.body.message).toEqual("You can't perform as of now");
});

it("drop collections if env is development", async () => {
  process.env.NODE_ENV = 'development';
  const response = await request(app).post("/api/common/drop/collections").expect(200);
  expect(response.body).toHaveProperty("collections");
  expect(response.body.collections.length).toEqual(2);
});