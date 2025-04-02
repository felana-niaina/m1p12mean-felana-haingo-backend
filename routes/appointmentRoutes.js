import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsSummary,
  getOneAppointment,
  getRecentAppointmentsToValidate,
  updateAppointmentStatus,
  acceptAppointment,
  getUnavailableDates,
  assignMechanic,
  getAppointmentsByClient
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/recent" , getRecentAppointmentsToValidate);
router.get("/unavailableDate" , getUnavailableDates)
router.post("/", createAppointment);
router.post("/accept", acceptAppointment);
router.post("/assignMechanic", assignMechanic);
router.get("/allAppointments", getAllAppointments);
router.put("/:id/status", updateAppointmentStatus);
router.get("/:id", getOneAppointment);
router.get("/", getAppointmentsSummary);
router.get("/historiques/:clientId",getAppointmentsByClient );


export default router;
