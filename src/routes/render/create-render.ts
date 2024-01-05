import express from "express";

const router = express.Router();

router.post("/api/render", async (req, res) => {
  res.json({ message: "Render Created" });
});

export { router as renderCreateRouter };
