import express from "express";

const router = express.Router();

router.post("/api/render/ping", async (req, res) => {
  res.json({ message: "Render Ping Pong" });
});

export { router as renderPingRouter };
