import express from "express";
import { Render } from "../../models/key/render";
import { RenderResponse_ShowRenders } from "@com.xcodeclazz/address-table-server";
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
    const response: RenderResponse_ShowRenders = { renders };
    res.json(response);
  }
);

export { router as renderShowRouter };
