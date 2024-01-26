import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import { BadRequestError } from "@com.xcodeclazz/monolithic-common";
import { RenderResponse_PingRenders } from "@com.xcodeclazz/address-table-server";

const router = express.Router();

router.post("/api/render/ping", async (req, res) => {
  const renders = await Render.find();
  try {
    _.forEach(renders, (e) => {
      axios
        .get(e.url)
        .then(async (res) => {
          let isActive = false;
          if (res.data?.ok == 1) isActive = true;
          await Render.findOneAndUpdate({ _id: e.id }, { isActive });
        })
        .catch(async (err) => {
          await Render.findOneAndUpdate({ _id: e.id }, { isActive: false });
        });
    });
  } catch (error) {
    throw new BadRequestError(JSON.stringify(error));
  }
  const response: RenderResponse_PingRenders = { ack: "Ping Pong" };
  res.json(response);
});

export { router as renderPingRouter };
