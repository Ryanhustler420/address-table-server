import express from "express";

const router = express.Router();

router.post("/api/target/ping", async (req, res) => {
  res.json({ message: "Target Ping Pong" });
});

export { router as targetPingRouter };
