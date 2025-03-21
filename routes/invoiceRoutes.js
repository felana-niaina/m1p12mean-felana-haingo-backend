import express from "express";
import {
  createInvoice,
  getAllInvoices,
  updateInvoiceStatus,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.put("/:id/status", updateInvoiceStatus);

export default router;
