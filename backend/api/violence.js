const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require("path");
const { exec } = require("child_process");

const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("video"), (req, res) => {
  const videoPath = path.join("uploads", req.file.filename);

  exec(`python violence_model/predict.py ${videoPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur Python:", stderr);
      return res.status(500).json({ error: "Erreur pendant la prédiction" });
    }
    res.json({ result: stdout.trim() });
  });
});

module.exports = router;
