import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/refresh-address-table",
  async (req: Request, res: Response) => {
    res.json({ message: "Refresh done" });
  }
);

export { router as refreshAddressTableRouter };
