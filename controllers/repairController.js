import Repair from "../models/Repair.js";

// Créer une réparation
export const createRepair = async (req, res) => {
  try {
    const { appointmentId, description, cost } = req.body;

    // Vérification si tous les champs sont présents
    if (!appointmentId || !description || cost === undefined) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Créer la réparation
    const newRepair = new Repair({
      appointmentId,
      description,
      cost,
    });

    await newRepair.save();
    res
      .status(201)
      .json({ message: "Réparation créée avec succès", repair: newRepair });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer toutes les réparations
export const getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find().populate("appointmentId");

    res.status(200).json(repairs);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour le statut d'une réparation
export const updateRepairStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const repair = await Repair.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!repair) {
      return res.status(404).json({ message: "Réparation non trouvée" });
    }

    res.status(200).json({ message: "Statut mis à jour", repair });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
