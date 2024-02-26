import _ from "lodash";
import { User } from "../models/key/user";
import { Roles, DUMMY_USER_ATTRS } from "@com.xcodeclazz/monolithic-common";

export const dummy_email = "example@test.com";
export const dummy_password = "123456";

export const createUser = async (roles: Roles[], is_banned?: boolean) => {
  const usr = DUMMY_USER_ATTRS(dummy_email, dummy_password);
  if (roles) usr.roles = roles;
  if (is_banned) usr.is_banned = is_banned;
  return await User.build(usr).save();
};