import Repair from "../models/Repair.js";
import User from "../models/User.js";

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

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

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

    // Ajouter le statut "à faire"
    const repairsData = {
      aFaire: 0,   // ➕ Ajout du statut "à faire"
      enCours: 0,
      termine: 0
    };

    repairsSummary.forEach(item => {
      if (item._id === "à faire") repairsData.aFaire = item.count;
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


export const getMechanicRepairs = async (req, res) => {
  try {
    const { mecanicienId } = req.query;
    if (!mecanicienId) {
      return res.status(400).json({ message: "L'ID du mécanicien est requis" });
    }
    const repairs = await Repair.find({ mecanicienId })
      .select("description status cost")
      .populate({
        path: "appointmentId",
        select: "description date",
        populate: [
          { path: "clientId", select: "name email" },
          { path: "vehicleId", select: "model" }
        ]
      });

    res.status(200).json(repairs);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}

export const getMechanicsWithCompletedRepairs = async (req, res) => {
  try {
    // Agrégation pour obtenir tous les mécaniciens et leur nombre de réparations terminées
    const mechanicsWithCompletedRepairs = await User.aggregate([
      // Associer le rôle pour récupérer son nom
      {
        $lookup: {
          from: "roles", // Nom de la collection en minuscule et au pluriel
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: {
          path: "$roleData",
          preserveNullAndEmptyArrays: true, // S'assurer qu'on garde les utilisateurs même si le rôle est manquant
        },
      },
      // Filtrer uniquement les mécaniciens
      {
        $match: {
          "roleData.name": "mecanicien",
        },
      },
      // Associer les réparations
      {
        $lookup: {
          from: "repairs",
          localField: "_id",
          foreignField: "mecanicienId",
          as: "repairs",
        },
      },
      // Calculer le nombre de réparations terminées
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          specialty: 1,
          completedRepairs: {
            $size: {
              $filter: {
                input: "$repairs",
                as: "repair",
                cond: { $eq: ["$$repair.status", "terminé"] },
              },
            },
          },
        },
      },
    ]);
    
    console.log(mechanicsWithCompletedRepairs);
    
    

    // Renvoyer la réponse
    res.status(200).json(mechanicsWithCompletedRepairs);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({
      message: "Erreur serveur, veuillez réessayer plus tard.",
      error: error.message,
    });
  }
};
// Fonction utilitaire pour vérifier la validité d'une date
const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};
