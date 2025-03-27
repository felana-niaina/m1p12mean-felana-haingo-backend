import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getOneAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.put("/:id/status", updateAppointmentStatus);
router.get("/:id", getOneAppointment);

export default router;
