// Déclaration du Router
const express = require('express');
const router = express.Router();

// Importation des Middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importation du Controller
const saucesCtrl = require('../controllers/sauces');

// Enregitrer des sauces dans la base de données
router.post('/', auth, multer, saucesCtrl.createSauce);
// Mettre à jour une sauce 
router.put('/:id', auth,multer, saucesCtrl.modifySauce);
// Supprimer une sauces
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// Récupérer de la liste des sauces
router.get('/', auth, saucesCtrl.getAllSauces);
//Récupérer une sauce spécifique
router.get('/:id', auth, saucesCtrl.getOneSauce);
// Liker ou disliker une sauce
// router.post('/:id/like', auth, saucesCtrl.likeSauce);


// Exportation du Router
module.exports = router;