const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');


// Configuration de multer pour accepter les fichiers
const upload = multer({ dest: 'uploads/' });

// Route pour prédiction radiologique
router.post('/predict-radiology', upload.single('image'), async (req, res) => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(req.file.path));

  try {
    const response = await axios.post('http://localhost:5000/predict', formData, {
      headers: formData.getHeaders()
    });

    fs.unlinkSync(req.file.path);

    // ✅ Assure-toi que tu renvoies une vraie réponse JSON
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.json(response.data);

  } catch (err) {
    console.error("Erreur appel Flask:", err.message);
    res.status(500).json({ error: "Erreur prédiction Flask" });
  }
});





module.exports = router;
