const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

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
app.use("/api/user", userRoutes);
app.use("/api/roles", roleRoutes);


app.listen(PORT, () => console.log(`Serveur démarré sur le port
${PORT}`));