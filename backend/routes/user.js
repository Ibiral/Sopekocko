// Déclaration du Router
const express = require('express');
const router = express.Router();

// Importation du Controller
const userCtrl = require('../controllers/user');

//Routes d'authentification
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;