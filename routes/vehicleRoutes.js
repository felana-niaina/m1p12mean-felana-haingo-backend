import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehiclesByClient,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getAllVehicles);
router.get("/:ownerId", getVehiclesByClient);
router.delete("/:id", deleteVehicle);

export default router;
