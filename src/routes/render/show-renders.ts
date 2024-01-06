import express from "express";
import { Render } from "../../models/key/render";
import {
  adminUser,
  currentUser,
  requireAuth,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.get(
  "/api/render",
  currentUser,
  requireAuth,
  adminUser,
  async (req, res) => {
    const renders = await Render.find().sort({ capacity: 1 });
    res.json(renders);
  }
);

export { router as renderShowRouter };
