import { app } from "../../app";
import request from "supertest";
import axios from "axios";

it("return all the posts", async () => {
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { message: "Mocked response" } });
  (axios.get as jest.Mock).mockResolvedValueOnce({ data: { message: "hello" } });

  const response = await request(app).get("/api/load-balancer/posts");

  expect(response.body).toHaveProperty('users');
  expect(response.body).toHaveProperty('comments');

  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.get).toHaveBeenCalledTimes(2);
});
