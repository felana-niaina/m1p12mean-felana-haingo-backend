import express from "express";
import {
  createRepair,
  getAllRepairs,
  getTotalRepairs,
  updateRepairStatus,
} from "../controllers/repairController.js";

const router = express.Router();

router.post("/", createRepair);
router.get("/", getAllRepairs);
router.put("/:id/status", updateRepairStatus);
router.get("/totalRepairs" , getTotalRepairs);

export default router;
