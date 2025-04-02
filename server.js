import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import indexRoutes from "./routes/index.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import repairRoutes from "./routes/repairRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/repairs", repairRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/notifications", notificationRoutes);
app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/contact", contactRoutes);
app.use('/uploads', express.static('uploads'));



app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
