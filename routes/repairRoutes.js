const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repairController");

router.post("/", repairController.createRepair);
router.get("/", repairController.getAllRepairs);
router.put("/:id/status", repairController.updateRepairStatus);

module.exports = router;
