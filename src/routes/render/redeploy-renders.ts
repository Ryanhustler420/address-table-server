import _ from "lodash";
import axios from "axios";
import express from "express";
import { Render } from "../../models/key/render";
import { RenderResponse_RedeployRenders } from "@com.xcodeclazz/address-table-server";
import {
  requireAuth,
  currentUser,
  BadRequestError,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/render/redeploy",
  currentUser,
  requireAuth,
  async (req, res) => {
    const renders = await Render.find();
    const promises = _.map(renders, async (e) => {
      const url = `https://api.render.com/v1/services/${e?.serviceId}/deploys`;
      const headers = {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${e?.authToken}`,
      };
      return await axios.post(url, {}, { headers });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      throw new BadRequestError(JSON.stringify(error));
    }

    const response: RenderResponse_RedeployRenders = {
      message: "Render Redeploy Trigger",
    };
    res.json(response);
  }
);

export { router as renderRedeployRouter };
