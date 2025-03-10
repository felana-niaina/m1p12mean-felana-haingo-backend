const Role = require("../models/Role");
const mongoose = require("mongoose");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Vérifier si le rôle existe déjà
    const roleExists = await Role.findOne({ name });
    if (roleExists) return res.status(400).json({ message: "Ce rôle existe déjà" });

    // Créer le rôle
    const newRole = new Role({
      _id: new mongoose.Types.ObjectId(), // Génération automatique d'un ObjectId
      name
    });

    await newRole.save();
    res.status(201).json({ message: "Rôle créé avec succès", role: newRole });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
