import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.put("/:id", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
