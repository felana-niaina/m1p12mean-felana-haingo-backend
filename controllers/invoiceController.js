import Invoice from "../models/Invoice.js";
import Repair from "../models/Repair.js";

//  Créer une facture
export const createInvoice = async (req, res) => {
  try {
    const { clientId, repairId } = req.body;

    // Vérification si la réparation existe
    const repair = await Repair.findById(repairId);
    if (!repair)
      return res.status(404).json({ message: "Réparation non trouvée" });

    // Création de la facture
    const newInvoice = new Invoice({
      clientId,
      repairId,
      amount: repair.cost, // Utilisation du coût de la réparation comme montant
    });

    await newInvoice.save();
    res
      .status(201)
      .json({ message: "Facture créée avec succès", invoice: newInvoice });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Récupérer toutes les factures
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("clientId", "name email")
      .populate("repairId");

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

//  Mettre à jour le statut d'une facture
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.status(200).json({ message: "Statut mis à jour", invoice });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
