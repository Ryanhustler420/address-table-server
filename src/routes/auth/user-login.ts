import jwt from "jsonwebtoken";
import { JWT_KEY } from "../../env";
import { User } from "../../models/key/user";
import { Password } from "../../services/password";
import express, { Request, Response } from "express";
import cookieConfig from "../../services/cookie-config";
import { celebrate, Segments } from "@com.xcodeclazz/celebrate";
import {
  custom_jwt,
  currentUser,
  notRequireAuth,
  BadRequestError,
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
    res
      .cookie("Set-Cookie", custom_jwt.encode(userJwt), cookieConfig)
      .status(200)
      .send(existingUser);
  }
);

export { router as authUserLoginRouter };
