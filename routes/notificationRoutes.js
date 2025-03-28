import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.put("/:id", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
