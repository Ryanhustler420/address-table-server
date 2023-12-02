import socket from "./socket";
import { app } from "./app";
import { PORT } from "./env";

const server = socket(app);

const start = async () => {
  const HOST = "0.0.0.0";
  server.listen(PORT, HOST, () => {
    console.log(`Server is on http://${HOST}:${PORT}`);
  });
};

start();
