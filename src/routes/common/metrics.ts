import axios from "axios";
import express from "express";
import prometheus from "prom-client";
import { InternalServerError } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.get("/api/common/metrics", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:9100/metrics");
    res.set("Content-Type", prometheus.register.contentType);
    res.end(response.data);
  } catch (error) {
    throw new InternalServerError("Node Exporter Not Running");
  }
});

const registry = new prometheus.Registry();
const counter = new prometheus.Counter({
  name: 'example_counter',
  help: 'A simple example counter metric',
  registers: [registry],
});

router.get("/api/common/metrics/app", async (req, res) => {
  counter.inc();
  res.set("Content-Type", registry.contentType);
  res.end(await registry.metrics());
});

export { router as commonMetricsRouter };
