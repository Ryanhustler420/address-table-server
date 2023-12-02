import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { NODE_ENV } from "./env";
import cors from 'cors';

import { errorHandler, NotFoundError } from "@xcc.com/xcc-common";
import { celebrate_custome_errors } from "@xcc.com/xcc-celebrate";

import { healthChecksRouter } from "./routes/health-checks";
import { showPostsRouter } from "./routes/show-posts";

const app = express();

app.use(cors({ origin: "*", exposedHeaders: ["base64"] }));
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: NODE_ENV !== "test",
  })
);

app.use(showPostsRouter);
app.use(healthChecksRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(celebrate_custome_errors());
app.use(errorHandler);

export { app };
