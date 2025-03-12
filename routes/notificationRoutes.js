const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.createNotification);
router.get("/:userId", notificationController.getUserNotifications);
router.put("/:id", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
