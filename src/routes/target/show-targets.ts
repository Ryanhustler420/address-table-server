import express from "express";
import config from "../../config.json";

const router = express.Router();

router.get("/api/target", async (req, res) => {
  // todo: return in decending order so that we can see the usage
  res.json(config);
});

export { router as targetShowRouter };
