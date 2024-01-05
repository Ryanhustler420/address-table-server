import axios from "axios";
import express from "express";
import prometheus from "prom-client";
import { InternalServerError } from "@com.xcodeclazz/monolithic-common";

const router = express.Router();

router.get("/api/auth/metrics", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:9100/metrics");
    res.set("Content-Type", prometheus.register.contentType);
    res.end(response.data);
  } catch (error) {
    throw new InternalServerError("Node Exporter Not Running");
  }
});

router.get("/api/auth/metrics/app", async (req, res) => {
  res.set("Content-Type", prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

export { router as authMetricsRouter };
