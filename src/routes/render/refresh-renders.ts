import express from "express";

const router = express.Router();

router.post("/api/render/refresh", async (req, res) => {
  res.json({ message: "Render Refreshed Trigger" });
});

export { router as renderRefreshRouter };
