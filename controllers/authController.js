import { SECRET_JWT_CODE } from "../constant/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "3600"; // Expiration du token

// Connexion d'un utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body.data;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role.name },
      SECRET_JWT_CODE,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Définition de l'URL de redirection
    const redirectTo = user.role.name === "manager" ? "/dashboard" : "/appointment";

    res.status(200).json({ message: "Connexion réussie", token, user,redirectTo , userId : user._id });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Middleware pour vérifier le token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
    if (!token) return res.status(401).json({ message: "Accès non autorisé" });

    const decoded = jwt.verify(token, SECRET_JWT_CODE);
    req.user = decoded; // Ajout des infos utilisateur à `req`
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// Récupérer les infos de l'utilisateur connecté
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("role");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Déconnexion de l'utilisateur
export const logout = async (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie" });
};
