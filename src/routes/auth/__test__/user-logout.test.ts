import request from "supertest";
import { app } from "../../../app";
import { register } from "../../../test/auth-helper";

const email = "example@test.com";
const password = "password";

it("return error if not logged in and try to logout", async () => {
  const { cookie } = await register();
  const response = await request(app).post("/api/auth/logout").expect(401);
  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
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
});

it("return error if try to logout but broken cookie provided", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("1", "."); // cookie
  cookie[1] = cookie[1].replace("1", "."); // session

  const response = await request(app)
    .post("/api/auth/logout")
    .set("Cookie", cookie)
    .expect(401);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0].message).toContain("Not authorized");
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
    "Set-Cookie=; Path=/"
  );
});
