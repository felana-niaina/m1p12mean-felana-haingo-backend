import express from "express";
import {
  login,
  verifyToken,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Routes publiques
router.post("/login", login);

// Routes protégées
router.get("/me", verifyToken, getCurrentUser);
router.post("/logout", verifyToken, logout);

export default router;
