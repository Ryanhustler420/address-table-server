import request from "supertest";
import { app } from "../../../app";
import { register } from "../../../test/auth-helper";

it("return nothing if broken cookie provided", async () => {
  const { cookie } = await register();
  cookie[0] = cookie[0].replace("1", "."); // cookie
  cookie[1] = cookie[1].replace("1", "."); // session

  const response = await request(app)
    .get("/api/auth/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
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
