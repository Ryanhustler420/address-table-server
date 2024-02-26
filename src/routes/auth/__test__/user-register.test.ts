import _ from "lodash";
import request from "supertest";
import { app } from "../../../app";
import { User } from "../../../models/key/user";
import { register } from "../../../test/auth-helper";
import { rabbitMqWrapper } from "../../../mq/rabbitmq-wrapper";
import { DUMMY_USER_ATTRS, Roles } from "@com.xcodeclazz/monolithic-common";

const timeout_ms = 5 * 60 * 1000;

const email = "example@test.com";
const password = "password";

const payload = DUMMY_USER_ATTRS(email, password);
_.unset(payload, "roles");
_.unset(payload, "is_banned");

describe("@concurrent", () => {
  it.concurrent(
    "register user #1",
    async () => {
      const custom = { ...payload };
      custom.email = `test1@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #2",
    async () => {
      const custom = { ...payload };
      custom.email = `test2@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #3",
    async () => {
      const custom = { ...payload };
      custom.email = `test3@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #4",
    async () => {
      const custom = { ...payload };
      custom.email = `test4@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #5",
    async () => {
      const custom = { ...payload };
      custom.email = `test5@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #6",
    async () => {
      const custom = { ...payload };
      custom.email = `test6@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #7",
    async () => {
      const custom = { ...payload };
      custom.email = `test7@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #8",
    async () => {
      const custom = { ...payload };
      custom.email = `test8@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #9",
    async () => {
      const custom = { ...payload };
      custom.email = `test9@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );

  it.concurrent(
    "register user #10",
    async () => {
      const custom = { ...payload };
      custom.email = `test10@xcc.com`;
      const response = await request(app)
        .post("/api/auth/register")
        .send(custom)
        .expect(201);
      expect(response.body).not.toHaveProperty("errors");
      expect(response.body.email).toEqual(custom.email);
    },
    timeout_ms
  );
});

describe("@sequence", () => {
  it("return error if data is not provided", async () => {
    const response = await request(app).post("/api/auth/register").expect(400);
    expect(response.body).toHaveProperty("errors");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("return error if wrong data is provided", async () => {
    const custom = { ...payload };
    custom.email = "exampledomain.com";

    const response = await request(app)
      .post("/api/auth/remove-admin")
      .send(custom)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("email");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("can't register if already logged in", async () => {
    const { cookie } = await register();

    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);

    const response = await request(app)
      .post("/api/auth/register")
      .set("Cookie", cookie)
      .send(payload)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("Please logout first");
  });

  it("can't register if already registered", async () => {
    const res1 = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(201);

    const res2 = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(400);

    expect(res1.body).toHaveProperty("email");
    expect(res2.body).toHaveProperty("errors");
    expect(res2.body.errors[0].message).toContain(
      "This email address is already in use"
    );
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);

    const user = await User.findOne({ email });
    expect(user?.id).toEqual(res1.body.id);
    expect(user?.name).toEqual(payload.name);
    expect(user?.email).toEqual(payload.email);
    expect(user?.address).toEqual(payload.address);
    expect(user?.city).toEqual(payload.city);
    expect(user?.country).toEqual(payload.country);
    expect(user?.dob).toEqual(payload.dob);
    expect(user?.gender).toEqual(payload.gender);
    expect(user?.avatar).toEqual(payload.avatar);
    expect(user?.phone).toEqual(payload.phone);
    expect(user?.roles).toEqual([Roles.NORMAL]);
    expect(user?.is_banned).toEqual(false);
    expect(user?.version).toEqual(0);
  });

  it("can't register if hit the wrong url", async () => {
    const response = await request(app)
      .post("/api/auth/register2")
      .send(payload)
      .expect(404);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("Not found");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("can't register if hit the corrent url but wrong method", async () => {
    const response = await request(app)
      .get("/api/auth/register2")
      .send(payload)
      .expect(404);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("Not found");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("can't register even if hit the correct url but provided extra data", async () => {
    const custom = { ...payload };
    custom.is_banned = true;

    const response = await request(app)
      .post("/api/auth/register")
      .send(custom)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("is_banned");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("can't register even if hit the correct url but provided less data", async () => {
    const custom: any = { ...payload };

    delete custom.avatar;
    delete custom.email;

    const response = await request(app)
      .post("/api/auth/register")
      .send(custom)
      .expect(400);

    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].message).toContain("avatar");
    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(0);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(0);

    const user = await User.findOne({ email });
    expect(user).toEqual(null);
  });

  it("register and return user if correct data provided", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(payload)
      .expect(201);

    expect(response.get("Base64")).toBeDefined();
    expect(response.get("Set-Cookie")).toBeDefined();

    expect((await rabbitMqWrapper.conn.createChannel()).assertQueue).toHaveBeenCalledTimes(8);
    expect((await rabbitMqWrapper.conn.createChannel()).sendToQueue).toHaveBeenCalledTimes(8);

    const user = await User.findOne({ email });
    expect(user?.name).toEqual(payload.name);
    expect(user?.email).toEqual(payload.email);
    expect(user?.address).toEqual(payload.address);
    expect(user?.city).toEqual(payload.city);
    expect(user?.country).toEqual(payload.country);
    expect(user?.dob).toEqual(payload.dob);
    expect(user?.gender).toEqual(payload.gender);
    expect(user?.avatar).toEqual(payload.avatar);
    expect(user?.phone).toEqual(payload.phone);
    expect(user?.roles).toEqual([Roles.NORMAL]);
    expect(user?.is_banned).toEqual(false);
    expect(user?.version).toEqual(0);
  });
});
