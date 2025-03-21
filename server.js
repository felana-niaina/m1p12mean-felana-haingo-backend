const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const repairRoutes = require("./routes/repairRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
 .catch(err => console.log(err));

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


app.listen(PORT, () => console.log(`Serveur démarré sur le port
${PORT}`));