import http from "http";
import socketIO from "socket.io";
import { Express } from "express";
import * as data from "./config.json";

export default function (app: Express) {
  const server = http.createServer(app);
  const io = new socketIO.Server(server, { cors: { origin: "*" } });

  const loadBalancer = new LoadBalancer(data.servers);

  io.on("connection", (socket) => {
    const userId = socket.id;

    // Assign an endpoint to the user on connection
    const assignedEndpoint = loadBalancer.assignEndpointToUser(userId);
    if (assignedEndpoint) {
      console.log(`User ${userId} connected and assigned to ${assignedEndpoint}`);
      socket.emit("assignedEndpoint", assignedEndpoint);
    } else {
      console.log(`User ${userId} connected, but no available endpoint`);
      socket.emit("noAvailableEndpoint");
    }

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected`);
      loadBalancer.releaseEndpointForUser(userId);
    });
  });

  return server;
}

export class LoadBalancer {
  private servers: { name: string; capacity: number }[];
  private userEndpoints: Map<string, string>;

  constructor(servers: { name: string; capacity: number }[]) {
    this.servers = servers;
    this.userEndpoints = new Map<string, string>();
  }

  assignEndpointToUser(userId: string): string | null {
    if (!this.userEndpoints.has(userId)) {
      const available = this.servers.find((e) => e.capacity >= 1);
      if (available) {
        available.capacity--;
        const endpoint = available.name;
        this.userEndpoints.set(userId, endpoint);
        return endpoint;
      }
    }
    return null;
  }

  releaseEndpointForUser(userId: string): void {
    const endpoint = this.userEndpoints.get(userId);
    if (endpoint) {
      this.userEndpoints.delete(userId);
      const server = this.servers.find((s) => s.name === endpoint);
      if (server) {
        server.capacity++;
      }
    }
  }
}
