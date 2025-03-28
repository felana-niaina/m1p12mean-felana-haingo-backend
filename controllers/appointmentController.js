import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

import nodemailer from "nodemailer";
import { mailConfig } from "../constant/utils.js";

let transporter = nodemailer.createTransport(mailConfig);

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
    console.log("id", id);

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
