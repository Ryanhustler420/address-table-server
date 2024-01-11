import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import { BadRequestError } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();
const timeout = 1000 * 10; // seconds

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

router.post("/api/compiler", async (req, res) => {
  const freeUrl = await getFreeUrl();
  if (freeUrl?.url) {
    try {
      axios.post(freeUrl.url, {
        
      })
    } catch (error) {
      throw new BadRequestError("The CPU became exhausted (2).");
    }
    // make a request and get the result and return to caller
    res.send(freeUrl);
  } else {
    throw new BadRequestError("The CPU became exhausted (1).");
  }
});

export { router as compilerRouter };
