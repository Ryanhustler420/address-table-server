import { spawn } from "child_process";
import mongoose from "mongoose";
import socket from "./socket";
import { app } from "./app";
import { PORT, DATABASE, MONGO_URI } from "./env";

const server = socket(app);

const start = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/${DATABASE}`);
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
