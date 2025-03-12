const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

// Routes publiques
router.post("/login", authController.login);

// Routes protégées
router.get("/me", authController.verifyToken, authController.getCurrentUser);
router.post("/logout", authController.verifyToken, authController.logout);

module.exports = router;
