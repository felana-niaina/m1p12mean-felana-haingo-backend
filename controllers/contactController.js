import nodemailer from "nodemailer";
import { mailConfig } from "../constant/utils.js";

let transporter = nodemailer.createTransport(mailConfig);

export const contact = async (req, res) => {
    try {
        const {
          name,
          email,
          message
        } = req.body.data;
        
        console.log(req.body.data)
        let mailOption = {
          from: email,
          to: "nirina.felananiaina@gmail.com",
          subject: `Nouveau message de ${name}`,
          text: `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };
    
        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            return console.log("error sendMail ::::", error.message);
          }
          console.log("mail sent !");
        });
    
        res.status(201).json({ message: "message envoyé avec succès" });
      } catch (error) {
        console.error("Erreur serveur :", error); // Ajoute cette ligne
        res.status(500).json({ message: "Erreur serveur", error: error.message });
      }
}