import express from "express";

import orders from "./orders";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API-Hello",
  });
});

router.use("/orders", orders);

export default router;
