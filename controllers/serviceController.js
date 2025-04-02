import path from "path";
import Service from "../models/Service.js";
import fs from 'fs';

// Contrôleur pour gérer l'ajout de service
export const createService = async (req, res) => {
  try {
    console.log("Données reçues :", req.body); 
    const { title, description, image } = req.body; // image sera envoyée en base64 depuis le front
    if (!title || !description) {
      return res.status(400).json({ message: "Le titre et la description sont requis." });
    }
    const newService = new Service({
      title,
      description,
      image, // Stocker directement le base64
    });

    await newService.save();

    return res.status(201).json({
      message: "Service créé avec succès",
      service: newService,
    });
  } catch (error) {
    console.error("Erreur lors de la création du service:", error);
    return res.status(500).json({ message: "Erreur interne du serveur", error });
  }
};

//  Récupérer tous les services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mise à jour
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const existingService = await Service.findById(id);

    if (!existingService) {
      return res.status(404).json({ message: "Service non trouvé" });
    }

    existingService.title = title;
    existingService.description = description;

    if (image) {
      existingService.image = image; // Mettre à jour avec le base64
    }

    await existingService.save();

    return res.status(200).json({
      message: "Service mis à jour avec succès",
      service: existingService,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du service :", error);
    return res.status(500).json({ message: "Erreur interne du serveur", error });
  }
};


export const deleteService = async (req, res) => {
    try {
      const { id } = req.params;
  
      const service = await Service.findById(id);
      if (!service) {
        return res.status(404).json({ message: 'Service non trouvé' });
      }
  
      // Supprimer de l'image lié à ce service
      if (service.image) {
        const imagePath = path.resolve(service.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de l\'image :', err);
          } else {
            console.log('Image supprimée avec succès');
          }
        });
      }
  
      
      await Service.findByIdAndDelete(id);
  
      return res.status(200).json({ message: 'Service supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };