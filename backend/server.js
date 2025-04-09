// 📌 Connexion à MongoDB
require('./config/db');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
require('dotenv').config();

const app = express();
const port = 3000;

// 📌 Importation des routes
const UserRouter = require('./api/User');
const specialiteRouter = require('./api/Specialite');
const documentRouter = require('./api/Document'); // Ajout du routeur des documents

// ✅ Activation de CORS
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3002"], // Autorise les frontends
  credentials: true, // Important pour cookies + sessions
}));

// ✅ Middleware pour parser JSON et URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Activation du Cookie Parser
app.use(cookieParser());

// ✅ Configuration des Sessions avec MongoDB Store
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/EmergencyMangment",
    ttl: 24 * 60 * 60 // 1 jour d'expiration de session
  }),
  cookie: {
    httpOnly: true,
    secure: false, // `true` si HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // Expiration de 1 jour
  }
}));

// ✅ Route de test de session
app.get("/test-session", (req, res) => {
  req.session.test = "Session is working!";
  res.json({ message: "Session saved!", session: req.session });
});

// 📌 Routes
app.use('/user', UserRouter);
app.use('/specialite', specialiteRouter);
app.use('/document', documentRouter); // Ajout de la route pour les documents


// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
