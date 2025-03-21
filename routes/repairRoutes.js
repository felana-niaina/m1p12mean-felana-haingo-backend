import express from "express";
import {
  createRepair,
  getAllRepairs,
  updateRepairStatus,
} from "../controllers/repairController.js";

const router = express.Router();

router.post("/", createRepair);
router.get("/", getAllRepairs);
router.put("/:id/status", updateRepairStatus);

export default router;
