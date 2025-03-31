import express from "express";
import {
  createRepair,
  getAllRepairs,
  getMechanicRepairs,
  getMechanicsWithCompletedRepairs,
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
router.get('/mechanic-repair-performance', getMechanicsWithCompletedRepairs);
export default router;
