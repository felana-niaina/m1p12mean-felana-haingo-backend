import Appointment from "../models/Appointment.js";

export const createAppointment = async (req, res) => {
  try {
    const { clientId, vehicleId, date } = req.body;
    const newAppointment = new Appointment({
      clientId,
      vehicleId,
      date,
    });
    await newAppointment.save();
    res.status(201).json({
      message: "Rendez-vous créé avec succès",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer tous les rendez-vous
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clientId", "name email")
      .populate("mecanicienId", "name specialty")
      .populate("vehicleId", "model");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre à jour le statut d'un rendez-vous
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.status(200).json({ message: "Statut mis à jour", appointment });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
// Récupérer un rendez-vous par son ID
export const getOneAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id" , id);

    const appointment = await Appointment.findById(id)
      .populate("clientId", "name email")
      .populate("mecanicienId", "name specialty")
      .populate("vehicleId", "model");

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
