import express from "express";
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.put("/:id/status", updateAppointmentStatus);

export default router;
