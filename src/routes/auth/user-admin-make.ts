import express, { Request, Response } from "express";
import {
  Roles,
  currentUser,
  requireAuth,
  BadRequestError,
  AuthResponse_MakeUserAdmin,
  AuthPayloadJoi_MakeUserAdmin,
} from "@com.xcodeclazz/monolithic-common";

import { ADMIN_PASSWORD } from "../../env";
import { User } from "../../models/key/user";
import { rabbitMqWrapper } from "../../mq/rabbitmq-wrapper";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import { sendToAll } from "../../mq/events/producers/auth/user-role-changed-producer";

const router = express.Router();

router.post(
  "/api/auth/make-admin",
  celebrate({ [Segments.BODY]: AuthPayloadJoi_MakeUserAdmin }),
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { email, code } = req.body;

    if (code !== ADMIN_PASSWORD) {
      throw new BadRequestError(
        "You are not allowed to perform this secret operation"
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Please check email address");
    }

    if (existingUser.is_banned) {
      throw new BadRequestError("User is banned");
    }

    if (!existingUser.roles?.includes(Roles.ADMIN)) {
      existingUser.roles?.push(Roles.ADMIN);
      await existingUser.save();
    }

    const response: AuthResponse_MakeUserAdmin = {
      message: "New role has been assigned to user"
    }

    await sendToAll(rabbitMqWrapper.conn, { 
      user: existingUser.id,
      blame: req.currentUser!.id.toString(),
      roles: existingUser.roles!,
    });

    res.status(200).send(response);
  }
);

export { router as authUserAdminMakeRouter };
