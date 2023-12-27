import http from "http";
import socketIO from "socket.io";
import { Express } from "express";
import * as data from "./config.json";
import LoadBalancer from "./load-balancer";

export default function (app: Express) {
  const server = http.createServer(app);
  const io = new socketIO.Server(server, { cors: { origin: "*" } });

  const loadBalancer = new LoadBalancer(data.servers);

  io.on("connection", (socket) => {
    const userId = socket.id;

    // Assign an endpoint to the user on connection
    const assignedEndpoint = loadBalancer.assignEndpointToUser(userId);
    if (assignedEndpoint) {
      console.log(`${userId} -> ${assignedEndpoint}`);
      socket.emit("assignedEndpoint", assignedEndpoint);
    } else {
      console.log(`${userId} -> RAN OUT OF SERVER`);
      socket.emit("noAvailableEndpoint");
    }

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`${userId} -> disconnected`);
      loadBalancer.releaseEndpointForUser(userId);
    });
  });

  return server;
}
