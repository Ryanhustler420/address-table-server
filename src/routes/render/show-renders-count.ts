import express from "express";
import { Render } from "../../models/key/render";
import { currentUser } from "@com.xcodeclazz/monolithic-common";
import { RenderResponse_ShowCountRenders } from "@com.xcodeclazz/address-table-server";

const router = express.Router();

router.get("/api/render/tags", currentUser, async (req, res) => {
  const result = await Render.aggregate([
    { $group: { _id: "$tags", count: { $sum: 1 } } },
  ]);
  const response: RenderResponse_ShowCountRenders = { state: result };
  res.json(response);
});

export { router as renderShowCountRouter };
