const User = require("../models/User");
const Role = require("../models/Role");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role, specialty, employees, vehicles } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Cet email est déjà utilisé" });

    // Vérifier si le rôle existe
    const roleData = await Role.findOne({ name: role });
    if (!roleData) return res.status(400).json({ message: "Rôle invalide" });

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        role: roleData._id, // On stocke l'ID du rôle
        specialty,
        employees,
        vehicles
      });

    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    console.error("Erreur serveur :", error); // Ajoute cette ligne
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role"); // Récupérer les utilisateurs avec leurs rôles
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

