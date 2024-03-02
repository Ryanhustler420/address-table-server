import { Roles, newObjectIdAsString } from "@com.xcodeclazz/monolithic-common";
import { register2 } from "../../../test/auth-helper";
import { app } from "../../../app";
import request from "supertest";
import axios from "axios";

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

  (axios.get as jest.Mock).mockResolvedValueOnce({
    data: {
      id: "dep-cngo20icn0vc73f78tf0",
      commit: null,
      image: {
        ref: "docker.io/gupta840/nodeapp:latest",
        sha: "sha256:5f4d7561bcb2146d0aa556e7233b6f48cfd9430f5e4b082c0edf78d7f343de94",
      },
      status: "update_in_progress",
      trigger: "api",
      createdAt: "2024-03-01T07:17:22.513162Z",
      updatedAt: "2024-03-01T07:17:23.899889Z",
      finishedAt: null,
    },
  });

  const redeploy = await request(app).post("/api/render/redeploy").expect(200);

  expect(redeploy.body).toHaveProperty("message");
  expect(redeploy.body.message).toContain("Render Redeploy Trigger");
});
