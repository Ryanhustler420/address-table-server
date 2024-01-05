import { ADMIN_PASSWORD } from "../../env";
import { User } from "../../models/key/user";
import express, { Request, Response } from "express";
import { Segments, celebrate } from "@com.xcodeclazz/celebrate";
import {
  Roles,
  currentUser,
  requireAuth,
  BadRequestError,
  AuthPayloadJoi_RemoveUserAdmin,
} from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.post(
  "/api/auth/remove-admin",
  celebrate({ [Segments.BODY]: AuthPayloadJoi_RemoveUserAdmin }),
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

    if (existingUser.roles?.includes(Roles.ADMIN)) {
      existingUser.roles = existingUser.roles?.filter(
        (item) => item !== Roles.ADMIN
      );
      await existingUser.save();
    }

    res.status(200).send({ message: "Role has been removed from user" });
  }
);

export { router as authUserAdminRemoveRouter };
