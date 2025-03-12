const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

//  Ajouter un véhicule
exports.createVehicle = async (req, res) => {
  try {
    const { ownerId, model } = req.body;

    // Vérifier si l'utilisateur existe et est un client
    const user = await User.findById(ownerId);
    if (!user || user.role !== "client") {
      return res.status(400).json({ message: "Propriétaire invalide" });
    }

    // Créer le véhicule
    const newVehicle = new Vehicle({ ownerId, model });
    await newVehicle.save();

    res.status(201).json({ message: "Véhicule ajouté avec succès", vehicle: newVehicle });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer tous les véhicules
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("ownerId", "name email");
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer les véhicules d'un client spécifique
exports.getVehiclesByClient = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const vehicles = await Vehicle.find({ ownerId }).populate("ownerId", "name email");

    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Supprimer un véhicule
exports.deleteVehicle = async (req, res) => {
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
