const Sauce = require('../models/Sauce');
const fs = require('fs');

// Création des sauces
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de l'ID généré automatiquement par la BDD
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

//Like/ Dislike des sauces
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1)  return likedSauce(req.params.id, req.body.userId, res);
  if (req.body.like === 0)  return cancelLikeSauce(req.params.id, req.body.userId, res);
  if (req.body.like === -1) return dislikedSauce(req.params.id, req.body.userId, res);
};

// 1- Liker une sauce
function likedSauce(idSauce, userId, res) {
  Sauce.updateOne({ _id: idSauce }, { $inc: { likes: 1 }, $push: { usersLiked: userId }, _id: idSauce })
    .then(() => res.status(201).json({ message: 'Sauce likée !' }))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
}

// 2- Disliker une sauce
function dislikedSauce(idSauce, userId, res) {
  Sauce.updateOne({ _id: idSauce }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }, _id: idSauce })
    .then(() => res.status(201).json({ message: 'Sauce dislikée !' }))
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// 3- Annuler Like/Dislike
function cancelLikeSauce(idSauce, userId, res) {
  Sauce.findOne({ _id: idSauce }) //réucpérer les informations de la sauce
    .then(sauce => {
      if (sauce.usersLiked.includes(userId)) {
        return Sauce.updateOne({ _id: idSauce }, { $inc: { likes: -1 }, $pull: { usersLiked: userId }, _id: idSauce })
          .then(() => res.status(201).json({ message: 'Like annulé !' }))
          .catch(error => res.status(400).json({ error })
          );
      }

      Sauce.updateOne({ _id: idSauce }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }, _id: idSauce })
        .then(() => res.status(201).json({ message: 'Dislike annulé !' }))
        .catch(error => {
          res.status(400).json({ error: error });
        })
    })
    .catch(error => res.status(500).json({ error }));
}




