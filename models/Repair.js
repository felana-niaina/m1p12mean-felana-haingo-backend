const mongoose = require("mongoose");

const RepairSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true }, // Référence au rendez-vous
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["à faire", "en cours", "terminé"], 
    default: "à faire" 
  },
  cost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Repair", RepairSchema);
