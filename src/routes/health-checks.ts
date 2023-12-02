import express from "express";
const router = express.Router();

// Readiness endpoint for health check
// Checks if your app is ready to receive traffics
router.get("/api/load-balancer/health/readiness", async (req, res) => {
  // You can check database connections, external service dependencies, etc.
  // Respond with a status code indicating readiness
  // Respond with meaning full response
  // Also make a time series for this route invokson
  res.status(200).send({ message: "Ok" });
});

// Liveness endpoint for health check
// Checks if your app is still functional
router.get("/api/load-balancer/health/liveness", async (req, res) => {
  // Perform quick checks to ensure the app is still functioning
  // Respond with a status code indicating liveness
  // Respond with meaning full response
  // Also make a time series for this route invokson
  res.status(200).send({ message: "Alive" });
});

export { router as healthChecksRouter };
