import express from "express";
import { Render } from "../../models/key/render";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import { RenderPayloadJoi_CreateRender } from "@com.xcodeclazz/address-table-server";
import {
  adminUser,
  currentUser,
  requireAuth,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/render",
  celebrate({ [Segments.BODY]: RenderPayloadJoi_CreateRender }),
  currentUser,
  requireAuth,
  adminUser,
  async (req, res) => {
    const render = Render.build(req.body);
    await render.save();
    res.json(render);
  }
);

export { router as renderCreateRouter };
