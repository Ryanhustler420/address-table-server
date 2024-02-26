import request from "supertest";
import { app } from "../../../app";
import { register } from "../../../test/auth-helper";
import { rabbitMqWrapper } from "../../../mq/rabbitmq-wrapper";

const email = "example@test.com";
const password = "password";

it("return error if not logged in and try to logout", async () => {
  const { cookie } = await register();
  const response = await request(app).post("/api/auth/logout").expect(401);
  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);
});

it("logouts user even if data provided, wrong or right", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie)
    .send({
      email,
      password,
    })
    .expect(200);

  expect(response.body).toEqual({});
  expect(response.get("Base64")).toEqual("");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(16);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(16);
});

it("return error if try to logout but broken cookie provided", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("0", "1");
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie)
    .expect(401);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);
});

it("return error if try to logout with differnt url", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/logout2")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);
});

it("return error if try to logout with corrent url but wrong method", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .get("/api/auth/logout")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);
});

it("clears the cookie after logout", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body).toEqual({});
  expect(response.get("Base64")).toEqual("");
  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(16);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(16);
});
