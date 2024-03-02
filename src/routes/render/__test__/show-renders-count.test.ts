import { Roles, newObjectIdAsString } from "@com.xcodeclazz/monolithic-common";
import { register2 } from "../../../test/auth-helper";
import { app } from "../../../app";
import request from "supertest";

it("Success", async () => {
  const cookie = await register2([Roles.ADMIN], newObjectIdAsString());

  const created = await request(app)
    .post("/api/render")
    .set("Cookie", cookie)
    .send({
      url: "https://example.com",
      email: "gouravgupta@gmail.com",
      tags: ["Java", "python"],
      capacity: 20,
      serviceId: "srv_123",
      authToken: "rnd_123",
      imageName: "repo/img",
      isActive: true,
      isLocked: false,
    })
    .expect(200);

  expect(created.body).toHaveProperty("url");
  expect(created.body).toHaveProperty("email");
  expect(created.body).toHaveProperty("tags");
  expect(created.body).toHaveProperty("capacity");
  expect(created.body).toHaveProperty("serviceId");
  expect(created.body).toHaveProperty("authToken");
  expect(created.body).toHaveProperty("imageName");
  expect(created.body).toHaveProperty("isActive");
  expect(created.body).toHaveProperty("isLocked");

  const count = await request(app)
    .get("/api/render/tags")
    .expect(200);

  expect(count.body).toHaveProperty("state");
  expect(count.body.state[0].count).toEqual(1);
  expect(count.body.state[0]._id).toEqual(["Java", "python"]);
});
