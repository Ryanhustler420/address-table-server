import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import { BadRequestError } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post("/api/render/ping", async (req, res) => {
  const renders = await Render.find();
  const promises = _.map(renders, async (e) => await axios.get(e.url));
  try {
    await Promise.all(promises);
  } catch (error) {
    throw new BadRequestError(JSON.stringify(error));
  }
  res.json({ message: "Render Pong" });
});

export { router as renderPingRouter };
