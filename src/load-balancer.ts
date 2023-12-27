export default class LoadBalancer {
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
