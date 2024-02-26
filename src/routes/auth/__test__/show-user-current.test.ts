import request from "supertest";
import { app } from "../../../app";
import { register } from "../../../test/auth-helper";

it("return nothing if not provided the cookies", async () => {
  const response = await request(app).get("/api/auth/currentuser").expect(200);
  expect(response.body.currentUser).toEqual(null);
});

it("return nothing if broken cookie provided", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("1", ".");

  const response = await request(app)
    .get("/api/auth/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

it("return nothing if hit wrong url with correct cookie", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .get("/api/auth/currentuser2")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
});

it("return nothing if hit wrong url with broken cookie", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("1", ".");

  const response = await request(app)
    .get("/api/auth/currentuser2")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
});

it("return nothing if hit correct url with broken cookie and different method", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("1", ".");

  const response = await request(app)
    .post("/api/auth/currentuser")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
});

it("return nothing if hit correct url with correct cookie and different method", async () => {
  const { cookie } = await register();

  const response = await request(app)
    .post("/api/auth/currentuser")
    .set("Cookie", cookie)
    .expect(404);

  expect(response.body).toHaveProperty("errors");
});

it("return user data even if we send some data with correct cookie", async () => {
  const { cookie } = await register();
  const response = await request(app)
    .get("/api/auth/currentuser")
    .set("Cookie", cookie)
    .send({
      name: "something",
    })
    .expect(200);

  expect(response.body.currentUser).toHaveProperty("email");
});

it("return user data if we hit correct url with correct cookie", async () => {
  const { cookie } = await register();

  const response = await request(app)
    .get("/api/auth/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.roles).toContain(0);
  expect(response.body.currentUser.email).toEqual("example@test.com");
});
