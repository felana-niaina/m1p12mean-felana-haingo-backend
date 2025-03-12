const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Référence au client
  model: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Vehicle", VehicleSchema);
