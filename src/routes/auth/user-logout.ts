import express from "express";
import { currentUser, requireAuth } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post("/api/auth/logout", currentUser, requireAuth, async (req, res) => {
  req.session = null;
  res.setHeader("base64", "");
  res.cookie("Set-Cookie", "").send({});
});

export { router as authUserLogoutRouter };
