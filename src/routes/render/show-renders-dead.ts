import express from "express";
import { Render } from "../../models/key/render";
import { currentUser } from "@com.xcodeclazz/monolithic-common";
import { RenderResponse_ShowDeadRenders } from "@com.xcodeclazz/address-table-server";

const router = express.Router();

router.get("/api/render/dead", currentUser, async (req, res) => {
  const result = await Render.find({ isActive: false });
  const response: RenderResponse_ShowDeadRenders = { renders: result };
  res.json(response);
});

export { router as renderShowDeadRouter };
