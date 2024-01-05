import _ from "lodash";
import jwt from "jsonwebtoken";
import { JWT_KEY } from "../../env";
import { User } from "../../models/key/user";
import express, { Request, Response } from "express";
import cookieConfig from "../../services/cookie-config";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import {
  Roles,
  custom_jwt,
  currentUser,
  notRequireAuth,
  BadRequestError,
  AuthPayloadJoi_RegisterUser,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/auth/register",
  celebrate({ [Segments.BODY]: AuthPayloadJoi_RegisterUser }),
  currentUser,
  notRequireAuth,
  async (req: Request, res: Response) => {
    const {
      name,
      address,
      city,
      state,
      country,
      dob,
      gender,
      avatar,
      phone,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("This email address is already in use");
    }

    const user = User.build({
      dob,
      city,
      name,
      state,
      phone,
      email,
      gender,
      avatar,
      country,
      address,
      password,
      is_banned: false,
      roles: [Roles.NORMAL],
    });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      JWT_KEY!
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    res.setHeader("base64", custom_jwt.encode(userJwt));
    res
      .cookie("Set-Cookie", custom_jwt.encode(userJwt), cookieConfig)
      .status(201)
      .send(user);
  }
);

export { router as authUserRegisterRouter };
