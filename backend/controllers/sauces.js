const Sauce = require('../models/Sauce');
const fs = require('fs');
const sauce = require('../models/Sauce');

// Création des sauces
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de l'ID généré automatiquement 
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Trouver une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Modification des sauces
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? //Le fichier existe t-il ?
    {
      ...req.body.sauce,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log(sauceObject)
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression des sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// //Like/ Dislike des sauces
// exports.likeSauce = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id }) //réucpérer les informations de la sauce
//   .then(sauce) => {

//   }
// }

// // Vérifier si l'utilisateur clique sur Like

// // Vérifier si l'utilisateur ne se trouve pas dans le tableau des usersLiked
// if (!sauce.usersLiked.includes(req.body.userId)) {

// // Mettre à jour la sauce 

// Sauce.updateOne({ _id: req.params.id }, { incrémenter les likes et ajouter l utilisateur au tableau usersLiked????????? })
//     .then(() => res.status(200).json({ message: 'Sauce likée !' }))
//     .catch(error => res.status(400).json({ error }));
// }



// // Vérifier si l'utilisateur ne se trouve pas dans le tableau des usersDisliked
// if (sauce.usersDisliked.includes(req.body.userId) === false) {

//   // Mettre à jour la sauce 
  
//   Sauce.updateOne({ _id: req.params.id }, { incrémenter les dislikes et ajouter l utilisateur au tableau usersDisliked????????? })
//       .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
//       .catch(error => res.status(400).json({ error }));
//   }