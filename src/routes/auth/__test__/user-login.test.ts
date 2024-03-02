import _ from "lodash";
import request from "supertest";
import { app } from "../../../app";
import { User } from "../../../models/key/user";
import { register } from "../../../test/auth-helper";
import { rabbitMqWrapper } from "../../../mq/rabbitmq-wrapper";
import { DUMMY_USER_ATTRS, hasAllKeysWithSameValues } from "@com.xcodeclazz/monolithic-common";

const email = "example@test.com";
const password = "password";

it("return error if not provided the data", async () => {
  const { cookie } = await register();
  const response = await request(app).post("/api/auth/login").expect(400);
  expect(response.body).toHaveProperty("errors");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if wrong email syntax provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test.com",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("email");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if short password provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      password: "123",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain('"email" is required');
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if correct email but short password provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: "123",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain(
    '"password" length must be at least 5 characters long'
  );
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if try to login even if already login", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .set("Cookie", cookie)
    .send({
      email: email,
      password: password,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Please logout first");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if wrong password provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: "wrongpassword",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Invalid credentials");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if wrong email provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "fake@domain.com",
      password: password,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Invalid credentials");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if try to login but not registered", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: password,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Invalid credentials");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);
});

it("return error if try to login but user is banned", async () => {
  const { cookie } = await register();
  await User.findOneAndUpdate({ email }, { $set: { is_banned: true } });

  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: password,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("You are banned");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("can't login user if cookies provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .set("Cookie", cookie)
    .send({
      email: email,
      password: password,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Please logout first");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if the url is not correct", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login2")
    .set("Cookie", cookie)
    .send({
      email: email,
      password: password,
    })
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if the url is correct but method is not", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .get("/api/auth/login")
    .set("Cookie", cookie)
    .send({
      email: email,
      password: password,
    })
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if some extra data provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: password,
      admin: 1,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain('"admin" is not allowed');
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("login user which gives response with a cookie when given valid credentials", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: email,
      password: password,
    })
    .expect(200);

  const payload = DUMMY_USER_ATTRS(email, password);
  _.unset(payload, "password");

  const all_matched = hasAllKeysWithSameValues(payload, response.body);
  expect(all_matched).toEqual(true);

  expect(response.get("Set-Cookie")).toBeDefined();
  expect(response.get("Base64")).toBeDefined();
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);
});
