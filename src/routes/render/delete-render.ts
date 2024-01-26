import express from "express";
import { Render } from "../../models/key/render";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import {
  RenderResponse_DeleteRender,
  RenderPayloadJoi_DeleteRender,
} from "@com.xcodeclazz/address-table-server";
import {
  adminUser,
  currentUser,
  requireAuth,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.delete(
  "/api/render",
  celebrate({ [Segments.BODY]: RenderPayloadJoi_DeleteRender }),
  currentUser,
  requireAuth,
  adminUser,
  async (req, res) => {
    const ack = await Render.findOneAndDelete({ url: req.body.url });
    const response: RenderResponse_DeleteRender = { url: req.body.url };
    res.json(response);
  }
);

export { router as renderDeleteRouter };
