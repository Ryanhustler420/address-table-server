import express from "express";
import {
  currentUser,
  requireAuth,
  AuthResponse_LogoutUser,
} from "@com.xcodeclazz/monolithic-common";
import { rabbitMqWrapper } from "../../mq/rabbitmq-wrapper";
import { sendToAll } from "../../mq/events/producers/auth/user-logout-producer";

const router = express.Router();

router.post("/api/auth/logout", currentUser, requireAuth, async (req, res) => {
  req.session = null;
  res.setHeader("base64", "");
  const response: AuthResponse_LogoutUser = {};

  await sendToAll(rabbitMqWrapper.conn, { user: req.currentUser!.id });
  res.send(response);
});

export { router as authUserLogoutRouter };
