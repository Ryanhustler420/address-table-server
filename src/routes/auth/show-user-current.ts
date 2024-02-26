import express from "express";
import {
  currentUser,
  AuthResponse_ShowCurrentUser,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.get("/api/auth/currentuser", currentUser, async (req, res) => {
  const response: AuthResponse_ShowCurrentUser = {
    currentUser: req.currentUser || null,
  };
  res.send(response);
});

export { router as authShowUserCurrentRouter };
