const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getAllInvoices);
router.put("/:id/status", invoiceController.updateInvoiceStatus);

module.exports = router;
