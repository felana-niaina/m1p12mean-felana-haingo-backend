import User from "../models/User.js";
import Role from "../models/Role.js";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { mailConfig } from "../constant/utils.js";
import crypto from "crypto";

let transporter = nodemailer.createTransport(mailConfig);

// Controller pour enregistrer un utilisateur
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

    console.log(req.body.data.speciality);

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

    // Vérification si l'utilisateur existe déjà
    let userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Cet email est déjà utilisé" });

    
    const roleData = await Role.findOne({ name: role });
    if (!roleData) return res.status(400).json({ message: "Rôle invalide" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: roleData._id, 
      specialty: speciality,
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

// Controller pour récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Controller pour mettre à jour un utilisateur
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

    
    let user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    
    if (role) {
      const roleData = await Role.findOne({ name: role });
      if (!roleData) return res.status(400).json({ message: "Rôle invalide" });
      user.role = roleData._id; 
    }

    
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.specialty = specialty || user.specialty;
    user.employees = employees || user.employees;
    user.vehicles = vehicles || user.vehicles;

    
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
  const { roleName } = req.params;
  
  try {
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      return res.status(404).json({ message: `Rôle ${roleName} non trouvé.` });
    }

    
    const users = await User.find({ role: role._id }).populate({
      path: "role",
      select: "name",
    });

    if (users.length === 0) {
      return res.status(404).json({ message: `Aucun utilisateur trouvé avec le rôle ${roleName}.` });
    }

    res.status(200).json(users); 
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Controller pour Mettre à jour le statut d'un utilisateur (activer/désactiver)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' ou 'inactive'
    const userId = req.params.id;

    // Mettre à jour le statut de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true } // Renvoie l'utilisateur mis à jour
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour générer un OTP aléatoire à 6 chiffres
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Controller pour enregistrer un mécanicien avec un OTP
export const registerWithOTP = async (req, res) => {
  try {
    const { name, email, phone,role, speciality } = req.body.data;


    // Vérification si l'utilisateur existe déjà
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Vérification du rôle "mécanicien"
    const roleData = await Role.findOne({ name: role });
    if (!roleData) return res.status(400).json({ message: "Rôle invalide" });

    // Générer un OTP
    const otp = generateOTP();
    const hashedTempPassword = await bcrypt.hash(otp, 10);

    // Création de l'utilisateur avec un OTP temporaire
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedTempPassword, // Pas de mot de passe initial
      role: roleData._id,
      specialty: speciality,
      otp, // Stocker l'OTP temporaire
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // Expiration dans 10 minutes
    });

    await newUser.save();

    // Configuration de l'email
    let mailOption = {
      from: "nirina.felananiaina@gmail.com",
      to: email,
      subject: "Votre compte mécanicien - OTP de connexion",
      html: `<!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Activation de compte</title>
                </head>
                <body>
                    <h3>Bienvenue chez Repairing Car Service</h3>
                    <p>Votre code OTP pour activer votre compte est : <strong>${otp}</strong></p>
                    <p>Ce code est valable 10 minutes.</p>
                    <p>Veuillez utiliser ce code pour configurer votre mot de passe.</p>
                </body>
                </html>`,
    };

    // Envoi de l'email
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log("Erreur lors de l'envoi de l'email :", error.message);
        return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
      }
      console.log("Email OTP envoyé !");
      res.status(201).json({ message: "Utilisateur créé avec succès. Vérifiez votre email pour l'OTP." });
    });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
