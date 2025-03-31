import express from "express";
import {
  createRepair,
  getAllRepairs,
  getMechanicRepairs,
  getRepairsStatusSummary,
  getTotalRepairs,
  updateRepairStatus,
} from "../controllers/repairController.js";

const router = express.Router();

router.post("/", createRepair);
router.get("/", getAllRepairs);
router.put("/:id/status", updateRepairStatus);
router.get("/totalRepairs" , getTotalRepairs);
router.get("/summary" , getRepairsStatusSummary);
router.get("/mechanicRepairs" , getMechanicRepairs);

export default router;
