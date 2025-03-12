const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.post("/", vehicleController.createVehicle);
router.get("/", vehicleController.getAllVehicles);
router.get("/:ownerId", vehicleController.getVehiclesByClient);
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;
