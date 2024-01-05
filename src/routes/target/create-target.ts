import express from "express";

const router = express.Router();

router.post("/api/target", async (req, res) => {
  res.json({ message: "Target Created" });
});

export { router as targetCreateRouter };
