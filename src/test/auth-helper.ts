import { Roles, newObjectId } from "@com.xcodeclazz/monolithic-common";
import { DUMMY_USER_ATTRS } from "@com.xcodeclazz/monolithic-common";
import { JWT_KEY } from "../env";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";
import _ from "lodash";

const email = "example@test.com";
const password = "password";

export const register = async () => {
  const payload = DUMMY_USER_ATTRS(email, password);
  _.unset(payload, "roles");
  _.unset(payload, "is_banned");

  const response = await request(app)
    .post("/api/auth/register")
    .send(payload)
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return { user: response.body, cookie };
};

export const register2 = async (roles: Roles[], id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || newObjectId(),
    email: "example@domain.com",
    roles,
  };

  // Create the JWT!
  const token = jwt.sign(payload, JWT_KEY!);

  // Build the session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

export const register3 = async (user: any, id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || newObjectId(),
    email: user.email,
    roles: user.roles,
  };

  // Create the JWT!
  const token = jwt.sign(payload, JWT_KEY!);

  // Build the session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
