import express from "express";
import { createRole } from "../controllers/roleController.js";

const router = express.Router();

router.post("/add", createRole);

export default router;
