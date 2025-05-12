const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  const inputData = JSON.stringify(req.body);

  console.log("✅ Requête reçue :", req.body);
  console.log("📂 Exécution du script Python...");

  const python = spawn("python", ["predict.py", inputData]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error("❌ Erreur Python :", errorOutput);
      return res.status(500).json({ error: "Erreur lors de la prédiction." });
    }

    try {
      const matches = output.match(/\{.*\}/g);
      const prediction = JSON.parse(matches[matches.length - 1]);

      console.log("🎉 Prédiction :", prediction);
      res.json(prediction);
    } catch (e) {
      console.error("❌ Erreur JSON :", e.message);
      res.status(500).json({ error: "Erreur de parsing du résultat Python." });
    }
  });
});

module.exports = router;
