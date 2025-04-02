import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Repair from "../models/Repair.js"
import nodemailer from "nodemailer";
import { mailConfig } from "../constant/utils.js";

let transporter = nodemailer.createTransport(mailConfig);

export const createAppointment = async (req, res) => {
  try {
    const { clientId, vehicleId, date , description } = req.body;
    const newAppointment = new Appointment({
      clientId,
      vehicleId,
      date,
      description
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
    console.log("id", id);

    const appointment = await Appointment.findById(id)
      .populate("clientId", "name email")
      .populate("mecanicienId", "name specialty")
      .populate("vehicleId", "model");

    if (!appointment) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    const repair = await Repair.findOne({ appointmentId: id }).select("cost");

    const repairCost = repair ? repair.cost : null;

    res.status(200).json({ appointment, repairCost });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getAppointmentsSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  // Vérifier si les dates sont valides
  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Les dates de début et de fin sont requises." });
  }

  // Vérifier si les dates sont valides
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).json({ message: "Les dates doivent être valides." });
  }

  try {
    const appointments = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }
      },
      {
        $group: {
          _id: "$status",  // Grouping by status
          count: { $sum: 1 },  // Counting the number of appointments per status
        }
      },
      {
        $project: { 
          status: "$_id", // Renaming _id to status
          count: 1, 
          _id: 0  // Excluding _id from the result
        }
      }
    ]);

    // Renvoie le tableau des statuts et leurs comptages
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};



export const getRecentAppointmentsToValidate = async (req , res) => {
  try {
    const pendingAppointmentsCount = await Appointment.countDocuments({ status: "en attente" });
    res.status(200).json({ pendingAppointmentsCount });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getUnavailableDates = async (req, res) => {
  try {
    // Récupérer tous les rendez-vous confirmés
    const confirmedAppointments = await Appointment.find(
      { status: "confirmé" }, // Filtrer les rendez-vous confirmés
      { date: 1, _id: 0 } // Ne récupérer que la date
    );

    // Extraire uniquement les dates
    const unavailableDates = confirmedAppointments.map(appointment => appointment.date);

    res.status(200).json({ unavailableDates });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des dates indisponibles" });
  }
};



// Fonction utilitaire pour vérifier la validité d'une date
const isValidDate = (date) => {
  return !isNaN(Date.parse(date));
};

// Accepter un rendez-vous et envoyer une notification
export const acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: "clientId", select: "name email _id" })
      .populate("vehicleId");

    if (!appointment)
      return res.status(404).json({ message: "Rendez-vous non trouvé" });

    appointment.status = "confirmé";
    await appointment.save();

    
    const client = appointment.clientId;
    if (!client) {
      return res.status(404).json({ message: "Client lié non trouvé" });
    }

  
    const message = `Votre rendez-vous avec le véhicule ${appointment.vehicleId.model} a été accepté.`;

    
    const notification = new Notification({ userId: client._id,appointmentId: appointment._id, message });
    await notification.save();


    //Envoie de mail au client
    let mailOption = {
      from: "nirina.felananiaina@gmail.com",
      to: client.email,
      subject: "Car repairing",
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h3>Bonjour ${client.email},</h3>
                    <p>Votre rendez-vous chez repairing car a été validé, Merci.</p>
                    <span>Cordialement,</span>
                </body>
                </html>`,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return console.log("error sendMail ::::", error.message);
      }
      console.log("mail sent !");
    });

    res.status(200).json({
      message: "Rendez-vous accepté et notification envoyée",
      appointment,
      notification,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const assignMechanic = async (req, res) => {
  try {
    const { appointmentId,idMecanicien,repairCost } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: "clientId", select: "name email _id" })
      .populate("vehicleId");

    if (!appointment)
      return res.status(404).json({ message: "Rendez-vous non trouvé" });

    appointment.mecanicienId = req.body.idMecanien;
    await appointment.save();

    
    const client = appointment.clientId;
    if (!client) {
      return res.status(404).json({ message: "Client lié non trouvé" });
    }

  
    const message = `La réparation de votre véhicule ${appointment.vehicleId.model} est en cours.`;

    
    const notification = new Notification({ userId: client._id,appointmentId: appointment._id, message });
    await notification.save();

    

     // Créer un nouvel enregistrement dans la table Repair
     const newRepair = new Repair({
      appointmentId: appointment._id,
      mecanicienId: req.body.idMecanien,
      description: `Réparation programmée pour ${appointment.vehicleId.model}`,
      status: "à faire",
      cost: repairCost, // À définir ultérieurement
    });
    console.log(newRepair)
    await newRepair.save();

    //Envoie de mail au client
    let mailOption = {
      from: "nirina.felananiaina@gmail.com",
      to: client.email,
      subject: "Car repairing",
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h3>Bonjour ${client.email},</h3>
                    <p>Suite à votre rendez-vous chez repairing car , votre véhicule ${appointment.vehicleId.model} est en cours de réparation maintenant, Merci.</p>
                    <span>Cordialement,</span>
                </body>
                </html>`,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return console.log("error sendMail ::::", error.message);
      }
      console.log("mail sent !");
    });

    res.status(200).json({
      message: "Rendez-vous accepté et notification envoyée",
      appointment,
      notification,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// Récupération la liste des rendez-vous par client
export const getAppointmentsByClient = async (req, res) => {
  const { clientId } = req.query; 

  try {
    if (!clientId) {
      return res.status(400).json({ message: "L'ID du client est requis." });
    }

    const appointments = await Appointment.find({ clientId }).populate("vehicleId", "model");


    if (!appointments.length) {
      return res.status(200).json([]);
    }

    
    const appointmentsWithRepairStatus = await Promise.all(
      appointments.map(async (appointment) => {
        const repair = await Repair.findOne({ appointmentId: appointment._id }).select("status");

        
        return {
          ...appointment.toObject(),
          repairStatus: repair ? repair.status : "Non renseigné", 
        };
      })
    );

   
    return res.status(200).json(appointmentsWithRepairStatus);
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
