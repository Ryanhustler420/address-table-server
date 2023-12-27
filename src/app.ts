import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { NODE_ENV } from "./env";
import cors from "cors";

import { refreshAddressTableRouter } from "./routes/refresh-address-table";

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

app.use(refreshAddressTableRouter);

app.all("*", async (req, res) => {
  res.json({
    message: "Please don't invoke me, it hurts",
  });
});

export { app };
