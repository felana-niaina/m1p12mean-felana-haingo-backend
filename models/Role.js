import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, unique: true },
});

export default mongoose.model("Role", roleSchema);
