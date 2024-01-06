import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import {
  adminUser,
  currentUser,
  requireAuth,
  BadRequestError,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/render/refresh",
  currentUser,
  requireAuth,
  adminUser,
  async (req, res) => {
    const renders = await Render.find();
    const promises = _.map(renders, async (e) => {
      const url = `https://api.render.com/v1/services/${e.serviceId}/deploys`;
      const headers = {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${e.authToken}`,
      };
      return await axios.post(url, {}, { headers });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      throw new BadRequestError(JSON.stringify(error));
    }

    res.json({ message: "Render Refreshed Trigger" });
  }
);

export { router as renderRefreshRouter };
