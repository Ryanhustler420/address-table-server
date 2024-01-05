import "express-async-errors";
import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import cookieConfig from "./services/cookie-config";
import cors from "cors";

import { NotFoundError, errorHandler } from "@com.xcodeclazz/monolithic-common";
import { celebrate_custome_errors } from "@com.xcodeclazz/celebrate";

import { authDropCollectionsRouter } from "./routes/auth/drop-collections";
import { authShowUserCurrentRouter } from "./routes/auth/show-user-current";
import { authUserAdminRemoveRouter } from "./routes/auth/user-admin-remove";
import { authUserAdminMakeRouter } from "./routes/auth/user-admin-make";
import { authUserRegisterRouter } from "./routes/auth/user-register";
import { authUserLogoutRouter } from "./routes/auth/user-logout";
import { authUserLoginRouter } from "./routes/auth/user-login";
import { authMetricsRouter } from "./routes/auth/metrics";

import { renderShowRouter } from "./routes/render/show-renders";
import { renderCreateRouter } from "./routes/render/create-render";
import { renderPingRouter } from "./routes/render/ping-renders";
import { renderRefreshRouter } from "./routes/render/refresh-renders";

const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(cors({ origin: "*", exposedHeaders: ["base64"] }));
app.use(cookieSession(cookieConfig));

////////////
// WARNING: PLEASE DON'T CHANGE THE ROUTE ORDER
////////////

app.use(authShowUserCurrentRouter);
app.use(authUserRegisterRouter);
app.use(authUserAdminRemoveRouter);
app.use(authUserLogoutRouter);
app.use(authUserLoginRouter);
app.use(authUserAdminMakeRouter);
app.use(authDropCollectionsRouter);
app.use(authMetricsRouter);

app.use(renderShowRouter);
app.use(renderCreateRouter);
app.use(renderPingRouter);
app.use(renderRefreshRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(celebrate_custome_errors());
app.use(errorHandler);

export { app };
