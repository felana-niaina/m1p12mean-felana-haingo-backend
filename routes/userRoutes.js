const express = require("express");
const { register } = require("../controllers/userController");
const { getAllUsers } = require("../controllers/userController");

const router = express.Router();

router.post("/users", getAllUsers);
router.post("/register", register);

module.exports = router;
