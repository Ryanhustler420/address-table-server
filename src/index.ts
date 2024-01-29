import { rateLimit } from 'express-rate-limit';
import { spawn } from "child_process";
import mongoose from "mongoose";
import socket from "./socket";
import { app } from "./app";
import { PORT, DATABASE, MONGO_URI } from "./env";

const server = socket(app);
app.use(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Minute(s)
  message: { result: null },
  limit: 10,
}));

const start = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/${DATABASE}`);
    // await rabbitMqWrapper.connect(RABBIT_MQ);
    console.log("Connected to MongoDB");
    spawn("/usr/local/bin/node_exporter", {
      detached: false,
      stdio: "inherit",
    }).unref();
  } catch (err) {
    console.error("====================================");
    // @ts-ignore
    console.error(err?.message);
    console.error("====================================");
  }

  const HOST = "0.0.0.0";
  server.listen(PORT, HOST, () => {
    console.log(`Server is on http://${HOST}:${PORT}`);
  });
};

start();
