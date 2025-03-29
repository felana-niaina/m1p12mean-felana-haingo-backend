import multer from 'multer';
import path from 'path';
import Service from '../models/Service.js';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/services/');
  },
  filename: function (req, file, cb) {
    const name = file.originalname.trim();
    const splitName = name.split('.');
    cb(null, splitName[0] + '-' + new Date().getTime() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Contrôleur pour gérer l'ajout de service
export const createService = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de l'upload de l'image", error: err });
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
      return res.status(500).json({ message: "Erreur interne du serveur", error });
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
