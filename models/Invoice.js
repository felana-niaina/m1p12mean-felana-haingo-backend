const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence au client
  repairId: { type: mongoose.Schema.Types.ObjectId, ref: "Repair", required: true }, // Référence à la réparation
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["en attente", "payé", "annulé"], 
    default: "en attente" 
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
