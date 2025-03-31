import express from "express";
import { contact } from "../controllers/contactController.js";

const router = express.Router();
router.post("/message",contact);

export default router;
