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

export const getTotalRepairs = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérifier si les dates sont présentes
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Les dates de début et de fin sont requises." });
  }

  // Vérifier si les dates sont valides
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ message: "Les dates doivent être valides." });
  }

  try {
    // Convertir les dates de début et de fin en objets Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Vérifier si la date de fin est postérieure à la date de début
    if (start > end) {
      return res
        .status(400)
        .json({ message: "La date de fin doit être après la date de début." });
    }

    // Récupérer le nombre total de réparations terminées dans la période
    const totalRepairs = await Repair.countDocuments({
      createdAt: { $gte: start, $lte: end },
      status: "terminé",
    });

    return res.status(200).json({ totalRepairs });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({
      message: "Erreur serveur, veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};

export const getRepairsStatusSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérification des dates
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
  }

  try {
    // Convertir les dates en objets Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Obtenir le nombre de réparations en cours et terminées dans la période
    const repairsSummary = await Repair.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        }
      }
    ]);

    // Formater les résultats pour renvoyer un objet avec les données de chaque statut
    const repairsData = {
      enCours: 0,
      termine: 0
    };

    repairsSummary.forEach(item => {
      if (item._id === "en cours") repairsData.enCours = item.count;
      if (item._id === "terminé") repairsData.termine = item.count;
    });

    return res.status(200).json(repairsData);
  } catch (error) {
    console.error("Erreur serveur:", error);
    return res.status(500).json({
      message: "Erreur serveur, veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};
// Fonction utilitaire pour vérifier la validité d'une date
const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};
