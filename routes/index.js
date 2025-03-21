import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Projet MEAN déployé");
});

export default router;
