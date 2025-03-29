import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsSummary,
  getOneAppointment,
  getRecentAppointmentsToValidate,
  updateAppointmentStatus,
  acceptAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/recent" , getRecentAppointmentsToValidate);
router.post("/", createAppointment);
router.post("/accept", acceptAppointment);
router.get("/allAppointments", getAllAppointments);
router.put("/:id/status", updateAppointmentStatus);
router.get("/:id", getOneAppointment);
router.get("/", getAppointmentsSummary);


export default router;
