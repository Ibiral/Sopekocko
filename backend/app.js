// Importation des modules
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const path = require('path');

// Importation des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Application express
const app = express();

// Connexion à MongoDB
mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Gestion des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Middleware de sécurité
app.use(helmet());

// Gestion de JSON
app.use(express.json());

// Chemin de sauvegarde des photos dans le backend
app.use('/images', express.static(path.join(__dirname, 'images')));

// Les Routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
