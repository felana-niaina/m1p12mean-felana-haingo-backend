const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

router.post("/add", roleController.createRole);

module.exports = router;
