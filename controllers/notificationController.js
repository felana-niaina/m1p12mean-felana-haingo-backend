import Notification from "../models/Notification.js";
import User from "../models/User.js";

//  Envoyer une notification
export const createNotification = async (req, res) => {
  try {
    const { userId,appointmentId, message } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const notification = new Notification({ userId, message });
    await notification.save();

    res
      .status(201)
      .json({ message: "Notification envoyée avec succès", notification });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer les notifications d'un utilisateur
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params; 
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }); // Récupérer les notifications de cet utilisateur
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

//  Marquer une notification comme lue
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification non trouvée" });

    res
      .status(200)
      .json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Supprimer une notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification)
      return res.status(404).json({ message: "Notification non trouvée" });

    res.status(200).json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
