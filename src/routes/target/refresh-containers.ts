import express from "express";

const router = express.Router();

router.post("/api/target/refresh", async (req, res) => {
  res.json({ message: "Target Refreshed Trigger" });
});

export { router as targetRefreshRouter };
