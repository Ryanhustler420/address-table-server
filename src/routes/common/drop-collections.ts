import express from "express";
import { ENV } from "../../env";
import { User } from "../../models/key/user";
import { Render } from "../../models/key/render";
import { BadRequestError } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post("/api/common/drop/collections", async (req, res) => {
  if (ENV() == "development") {
    try {
      await User.deleteMany({});
      await Render.deleteMany({});
      res.send({
        collections: ["User", "Render"],
      });
    } catch (error) {
      new BadRequestError("Error occurred while dropping collections");
    }
  } else {
    res.send({ message: "You can't perform as of now" });
  }
});

export { router as commonDropCollectionsRouter };
