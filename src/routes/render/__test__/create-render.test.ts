import { Roles, newObjectIdAsString } from "@com.xcodeclazz/monolithic-common";
import { register2 } from "../../../test/auth-helper";
import { app } from "../../../app";
import request from "supertest";

it("Success", async () => {
  const cookie = await register2([Roles.ADMIN], newObjectIdAsString());

  const response = await request(app)
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

  expect(response.body).toHaveProperty("url");
  expect(response.body).toHaveProperty("email");
  expect(response.body).toHaveProperty("tags");
  expect(response.body).toHaveProperty("capacity");
  expect(response.body).toHaveProperty("serviceId");
  expect(response.body).toHaveProperty("authToken");
  expect(response.body).toHaveProperty("imageName");
  expect(response.body).toHaveProperty("isActive");
  expect(response.body).toHaveProperty("isLocked");
});
