import request from "supertest";
import { app } from "../../../app";
import { Roles } from "@com.xcodeclazz/monolithic-common";
import { User } from "../../../models/key/user";
import { register } from "../../../test/auth-helper";
import { rabbitMqWrapper } from "../../../mq/rabbitmq-wrapper";

const email = "example@test.com";
// const password = "password";

it("return error if data is not provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .expect(400);
  expect(response.body).toHaveProperty("errors");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);
});

it("return error if wrong data is provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .send({
      email: "examplefake.com",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("email");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if wrong data type is provided", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .send({
      email: "example@fake.com",
      code: false,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain('"code" must be a string');
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if not logged in user try to remove admin", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .send({
      email: "example@fake.com",
      code: "12345",
    })
    .expect(401);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin but code provided was wrong", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "123456",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain(
    "You are not allowed to perform this secret operation"
  );
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a non-existing user", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: "example@domain.com",
      code: "12345",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain(
    "Please check email address"
  );
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a existing user but the user is banned", async () => {
  const { cookie } = await register();
  await User.findOneAndUpdate({ email }, { $set: { is_banned: true } });

  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("User is banned");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a existing user but broken cookie provided", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("0", "1");
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(401);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a existing user but hit wrong url", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin2")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a existing user with correct url hit but wrong method", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .get("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(404);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not found");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("return error if try to remove admin a existing user but provided extra data", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
      princess: true,
    })
    .expect(400);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain(
    '"princess" is not allowed'
  );
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(4);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(4);

  const user = await User.findOne({ email });
  expect(user?.roles).not.toContain(Roles.ADMIN);
});

it("response with a message when given valid credentials", async () => {
  const { cookie } = await register();
  await request(app)
    .post("/api/auth/make-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(200);

  expect((await User.findOne({ email }))?.roles).toContain(Roles.ADMIN);

  const response = await request(app)
    .post("/api/auth/remove-admin")
    .set("Cookie", cookie)
    .send({
      email: email,
      code: "12345",
    })
    .expect(200);

  expect(response.body.message).toEqual("Role has been removed from user");
  expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(12);
  expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(12);

  expect((await User.findOne({ email }))?.roles).not.toContain(Roles.ADMIN);
});
