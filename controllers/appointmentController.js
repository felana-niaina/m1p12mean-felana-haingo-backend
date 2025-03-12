const Appointment = require("../models/Appointment");

//  Créer un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const { clientId, mecanicienId, vehicleId, date } = req.body;

    // Vérifier si tous les champs sont présents
    if (!clientId || !mecanicienId || !vehicleId || !date) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Créer le rendez-vous
    const newAppointment = new Appointment({
      clientId,
      mecanicienId,
      vehicleId,
      date,
    });

    await newAppointment.save();
    res.status(201).json({ message: "Rendez-vous créé avec succès", appointment: newAppointment });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer tous les rendez-vous
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("clientId", "name email")
      .populate("mecanicienId", "name specialty")
      .populate("vehicleId", "brand model");
      
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre à jour le statut d'un rendez-vous
exports.updateAppointmentStatus = async (req, res) => {
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
