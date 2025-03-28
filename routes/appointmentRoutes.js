import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getOneAppointment,
  updateAppointmentStatus,
  acceptAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.post("/accept", acceptAppointment);
router.get("/", getAllAppointments);
router.put("/:id/status", updateAppointmentStatus);
router.get("/:id", getOneAppointment);

export default router;
