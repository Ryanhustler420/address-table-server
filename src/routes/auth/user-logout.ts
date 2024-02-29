import express from "express";
import { rabbitMqWrapper } from "../../mq/rabbitmq-wrapper";
import { sendToAll } from "../../mq/events/producers/auth/user-logout-producer";
import {
  currentUser,
  requireAuth,
  AuthResponse_LogoutUser,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post("/api/auth/logout", currentUser, requireAuth, async (req, res) => {
  req.session = null;
  res.setHeader("base64", "");
  const response: AuthResponse_LogoutUser = {};
  await sendToAll(rabbitMqWrapper.conn, { user: req.currentUser!.id.toString() });
  res.send(response);
});

export { router as authUserLogoutRouter };
