import jwt from "jsonwebtoken";
import { User } from "../../models/key/user";
import { ADMIN_PASSWORD, JWT_KEY } from "../../env";
import express, { Request, Response } from "express";
import { encode } from "@com.xcodeclazz/session-controller";
import { rabbitMqWrapper } from "../../mq/rabbitmq-wrapper";
import { Password } from "@com.xcodeclazz/monolithic-common";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import { sendToAll } from "../../mq/events/producers/auth/user-login-producer";
import {
  custom_jwt,
  currentUser,
  notRequireAuth,
  BadRequestError,
  AuthResponse_LoginUser,
  AuthPayloadJoi_LoginUser,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/auth/login",
  celebrate({ [Segments.BODY]: AuthPayloadJoi_LoginUser }),
  currentUser,
  notRequireAuth,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password || "",
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    if (existingUser.is_banned) {
      throw new BadRequestError("You are banned");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        roles: existingUser.roles,
      },
      JWT_KEY!
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    res.setHeader("base64", custom_jwt.encode(userJwt));

    await sendToAll(rabbitMqWrapper.conn, {
      user: existingUser.id,
    });

    const response: AuthResponse_LoginUser = {
      user: existingUser,
      session: encode({ email: existingUser.email }, ADMIN_PASSWORD),
    };
    res.status(200).send(response);
  }
);

export { router as authUserLoginRouter };
