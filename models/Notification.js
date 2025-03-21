import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Destinataire de la notification
  message: { type: String, required: true }, // Contenu de la notification
  isRead: { type: Boolean, default: false }, // Statut de la notification
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
