import Vehicle from "../models/Vehicle.js";
import User from "../models/User.js";

// Ajouter un véhicule
export const createVehicle = async (req, res) => {
  try {
    const { ownerId, model } = req.body;

    // Vérifier si l'utilisateur existe et est un client
    const user = await User.findById(ownerId).populate("role");

    if (!user || user.role.name !== "client") {
      return res.status(400).json({ message: "Propriétaire invalide" });
    }

    // Créer le véhicule
    const newVehicle = new Vehicle({ ownerId, model });
    await newVehicle.save();

    // Mettre à jour l'utilisateur pour ajouter le véhicule dans le tableau "vehicles"
    await User.updateOne(
      { _id: ownerId },
      { $push: { vehicles: newVehicle._id } } // Ajoute l'ID du véhicule à l'utilisateur
    );

    res
      .status(201)
      .json({ message: "Véhicule ajouté avec succès", vehicle: newVehicle });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer tous les véhicules
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("ownerId", "name email");
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer les véhicules d'un client spécifique
export const getVehiclesByClient = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const vehicles = await Vehicle.find({ ownerId }).populate(
      "ownerId",
      "name email"
    );

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Supprimer un véhicule
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Véhicule non trouvé" });
    }

    res.status(200).json({ message: "Véhicule supprimé avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
