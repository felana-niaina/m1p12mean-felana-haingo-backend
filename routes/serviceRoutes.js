import express from "express";
import { createService, getAllServices, updateService, deleteService } from "../controllers/serviceController.js";

const router = express.Router();

router.post("/add", createService);
router.get("/", getAllServices);
router.put('/update/:id', updateService);
router.delete('/:id', deleteService);

export default router;
