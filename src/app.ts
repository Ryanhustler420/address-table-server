import path from "path";
import "express-async-errors";
import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import cookieConfig from "./services/cookie-config";
import cors from "cors";

import { NotFoundError, errorHandler } from "@com.xcodeclazz/monolithic-common";
import { celebrate_custome_errors } from "@com.xcodeclazz/celebrate";

import { authShowUserCurrentRouter } from "./routes/auth/show-user-current";
import { authUserAdminRemoveRouter } from "./routes/auth/user-admin-remove";
import { authUserAdminMakeRouter } from "./routes/auth/user-admin-make";
import { authUserRegisterRouter } from "./routes/auth/user-register";
import { authUserLogoutRouter } from "./routes/auth/user-logout";
import { authUserLoginRouter } from "./routes/auth/user-login";

import { commonDropCollectionsRouter } from "./routes/common/drop-collections";
import { commonMetricsRouter } from "./routes/common/metrics";

import { renderShowRouter } from "./routes/render/show-renders";
import { renderCreateRouter } from "./routes/render/create-render";
import { renderPingRouter } from "./routes/render/ping-renders";
import { renderDeleteRouter } from "./routes/render/delete-render";
import { renderRedeployRouter } from "./routes/render/redeploy-renders";
import { renderShowDeadRouter } from "./routes/render/show-renders-dead";
import { renderShowCountRouter } from "./routes/render/show-renders-count";

import { compilersCppRouter } from "./routes/compilers/cpp";
import { compilersNodeRouter } from "./routes/compilers/node";
import { compilersJavaRouter } from "./routes/compilers/java";
import { compilersPythonRouter } from "./routes/compilers/python";

const app = express();
app.use(json());
app.set("trust proxy", true);
app.use(cors({ origin: "*", exposedHeaders: ["base64"] }));
app.use(cookieSession(cookieConfig));
if (process.env.NODE_ENV === "production") app.use(express.static(path.join(__dirname, "..", "client", "build")));

////////////
// WARNING: PLEASE DON'T CHANGE THE ROUTE ORDER
////////////

app.use(authShowUserCurrentRouter);
app.use(authUserRegisterRouter);
app.use(authUserAdminRemoveRouter);
app.use(authUserLogoutRouter);
app.use(authUserLoginRouter);
app.use(authUserAdminMakeRouter);

app.use(commonDropCollectionsRouter);
app.use(commonMetricsRouter);

app.use(renderShowRouter);
app.use(renderCreateRouter);
app.use(renderDeleteRouter);
app.use(renderPingRouter);
app.use(renderShowDeadRouter);
app.use(renderRedeployRouter);
app.use(renderShowCountRouter);

app.use(compilersCppRouter);
app.use(compilersJavaRouter);
app.use(compilersNodeRouter);
app.use(compilersPythonRouter);

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  } else res.json({ message: "NO UI FOUND" });
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(celebrate_custome_errors());
app.use(errorHandler);

export { app };
