import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Référence au client
    mecanicienId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Référence au mécanicien
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    }, // Référence à la voiture
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["en attente", "confirmé", "terminé"],
      default: "en attente",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment;
