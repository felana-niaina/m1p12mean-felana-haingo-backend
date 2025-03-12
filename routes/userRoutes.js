const express = require("express");
const { register } = require("../controllers/userController");
const { getAllUsers } = require("../controllers/userController");
const { updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", register);
router.put("/:id", updateUser);

module.exports = router;
