import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import { BadRequestError } from "@com.xcodeclazz/monolithic-common";
import { CompilerPayloadJoi_Compiler } from "@com.xcodeclazz/address-table-server";

const router = express.Router();
const timeout = 1000 * 30; // seconds

const lockUrl = async (url: string) => {
  await Render.findOneAndUpdate({ url }, { isLocked: true });
  setTimeout(async () => {
    await Render.findOneAndUpdate({ url }, { isLocked: false });
  }, timeout);
};

const getFreeUrl = async () => {
  const render = await Render.findOne({ isLocked: false });
  if (render) {
    await lockUrl(render.url);
    return render;
  }
  return null;
};

router.post("/api/compiler", celebrate({ [Segments.BODY]: CompilerPayloadJoi_Compiler }), async (req, res) => {
  const freeUrl = await getFreeUrl();
  if (freeUrl?.url) {
    try {
      const result = await axios.post(freeUrl.url, req.body.payload);
      res.json(result);
    } catch (error) {
      throw new BadRequestError("The CPU became exhausted (2).");
    }
  } else {
    throw new BadRequestError("The CPU became exhausted (1).");
  }
});

export { router as compilerRouter };
