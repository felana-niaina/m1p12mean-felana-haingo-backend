const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Projet MEAN déployé");
});

module.exports = router;
