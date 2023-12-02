import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/api/load-balancer/posts", async (req: Request, res: Response) => {
  try {
    const users = await axios.get("https://jsonplaceholder.typicode.com/users");
    const comments = await axios.get("https://jsonplaceholder.typicode.com/comments");
    res.json({ users: users.data, comments: comments.data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

export { router as showPostsRouter };
