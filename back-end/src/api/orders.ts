import express, { Request, Response } from "express";

import { paginatedResults } from "../middleware/pagination";
import {
  getPaginatedOrders,
  updateOrderStatus,
} from "../services/orderService";

const router = express.Router();

router.get(
  "/",
  paginatedResults(getPaginatedOrders),
  (req: Request, res: Response) => {
    res.json(res.paginatedResults);
  },
);

router.patch("/:id/status", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = updateOrderStatus(id, status);
    res.json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
