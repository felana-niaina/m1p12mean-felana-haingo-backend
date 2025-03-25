import User from "../models/User.js";
import Role from "../models/Role.js";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { mailConfig } from "../constant/utils.js";

let transporter = nodemailer.createTransport(mailConfig);

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      speciality,
      employees,
      vehicles,
    } = req.body.data;
    console.log(req.body.data);

    let mailOption = {
      from: "nirina.felananiaina@gmail.com",
      to: email,
      subject: "Car repairing",
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h3>Bienvenue chez repairing car service</h3>
                    <p>Veuillez cliquer le bouton ci-dessous pour vous connecter et prendre un rendez-vous :</p>
                    <button><a href="">Consulter</a></button>
                </body>
                </html>`,
    };

    // Vérifier si l'utilisateur existe déjà
    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Cet email est déjà utilisé" });

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
      speciality,
      employees,
      vehicles,
    });

    await newUser.save();
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return console.log("error sendMail ::::", error.message);
      }
      console.log("mail sent !");
    });

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error); // Ajoute cette ligne
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role"); // Récupérer les utilisateurs avec leurs rôles
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      password,
      role,
      specialty,
      employees,
      vehicles,
    } = req.body;

    // Vérifier si l'utilisateur existe
    let user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

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
    res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Controller pour récupérer les utilisateurs par rôle
export const getUsersByRole = async (req, res) => {
  
  const { roleName } = req.params; // Récupérer le nom du rôle depuis les paramètres de la requête
  console.log("roleName",roleName)
  try {
    // Trouver le rôle par son nom
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(404).json({ message: `Rôle ${roleName} non trouvé.` });
    }

    // Rechercher les utilisateurs ayant ce rôle (en utilisant l'ID du rôle)
    const users = await User.find({ role: role._id }).populate("role");

    if (!users.length) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé pour ce rôle." });
    }

    console.log("Utilisateurs récupérés : ", users); // Afficher les utilisateurs avec leur rôle

    res.status(200).json(role); // Retourner les utilisateurs
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

