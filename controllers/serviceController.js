import multer from "multer";
import path from "path";
import Service from "../models/Service.js";
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/services/");
  },
  filename: function (req, file, cb) {
    const name = file.originalname.trim();
    const splitName = name.split(".");
    cb(
      null,
      splitName[0] +
        "-" +
        new Date().getTime() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Contrôleur pour gérer l'ajout de service
export const createService = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'upload de l'image", error: err });
    }

    try {
      const { title, description } = req.body;

      const imagePath = req.file ? req.file.path : null;

      const newService = new Service({
        title,
        description,
        image: imagePath,
      });

      await newService.save();

      return res.status(201).json({
        message: "Service créé avec succès",
        service: newService,
      });
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
      return res
        .status(500)
        .json({ message: "Erreur interne du serveur", error });
    }
  });
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
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de l'upload de l'image", error: err });
    }

    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const existingService = await Service.findById(id);

      if (!existingService) {
        return res.status(404).json({ message: "Service non trouvé" });
      }

      let imagePath = existingService.image; // Conserve l'ancienne image par défaut

      if (req.file) {
        // Supprime l'ancienne image si elle existe
        if (existingService.image) {
          const oldImagePath = existingService.image
            ? path.resolve(existingService.image)
            : ""; // Vérifie si le chemin est non vide
          if (oldImagePath) {
            fs.unlink(oldImagePath, (err) => {
              if (err)
                console.error(
                  "Erreur lors de la suppression de l'ancienne image :",
                  err
                );
            });
          }
        }
        imagePath = req.file.path; // Remplace par la nouvelle image
      }

      // Mise à jour des données
      existingService.title = title;
      existingService.description = description;
      existingService.image = imagePath;

      await existingService.save();

      return res.status(200).json({
        message: "Service mis à jour avec succès",
        service: existingService,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service :", error);
      return res
        .status(500)
        .json({ message: "Erreur interne du serveur", error });
    }
  });
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