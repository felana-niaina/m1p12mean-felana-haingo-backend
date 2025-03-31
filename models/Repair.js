import mongoose from "mongoose";

const RepairSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    }, // Référence au rendez-vous
    mecanicienId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, 
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["à faire", "en cours", "terminé"],
      default: "à faire",
    },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Repair", RepairSchema);
