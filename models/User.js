import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    specialty: { type: String }, // Uniquement pour mécaniciens
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Uniquement pour managers
    vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }], // Uniquement pour clients
    status: { type: String, default: "active" }, // Ajout du champ status (valeurs possibles : 'active', 'inactive')
}, { timestamps: true });

export default mongoose.model("User", userSchema);
