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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password, role, specialty, employees, vehicles } = req.body;

    // Vérifier si l'utilisateur existe
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier si le rôle existe
    if (role) {
      const roleData = await Role.findOne({ name: role });
      if (!roleData) return res.status(400).json({ message: "Rôle invalide" });
      user.role = roleData._id; // Mise à jour du rôle
    }

    // Mise à jour des autres champs
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.specialty = specialty || user.specialty;
    user.employees = employees || user.employees;
    user.vehicles = vehicles || user.vehicles;

    // Mettre à jour le mot de passe s'il est fourni
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "Utilisateur mis à jour avec succès", user });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


