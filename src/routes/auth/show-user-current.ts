import express from "express";
import { currentUser } from "@com.xcodeclazz/monolithic-common";
const router = express.Router();

router.get("/api/auth/currentuser", currentUser, async (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as authShowUserCurrentRouter };
