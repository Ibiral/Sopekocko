const bcrypt = require('bcrypt'); //hashage de mot de passe en BD
const jwt = require('jsonwebtoken'); // TOKEN d'authentification
const User = require('../models/User');

//Enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {
    //hasher le mot de passe
    bcrypt.hash(req.body.password, 10) 
        .then(hash => {
            const user = new User({
                email: mask(req.body.email),
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Valisation de connexion de l'utilisateur
exports.login = (req, res, next) => {
    //Chercher si l'e-mail utilisateur est présent dans la BDD
    User.findOne({ email: mask(req.body.email) })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.TOKEN}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

const gap = 800;
function mask(email, reveal=false) {
  let newMail = "";
  let arobase = false;
  for (let i = 0; i < email.length; i++) {
    if (email[i] === "@") {
      newMail += "@";
      arobase = true;
      continue;
    }
    if (arobase && email[i] === "."){
      newMail += email.slice(i);
      break;
    }
    if (reveal) newMail += String.fromCharCode(email.charCodeAt(i) - gap);
    else        newMail += String.fromCharCode(email.charCodeAt(i) + gap);
  }
  return newMail;
}




// function unmask(email){
//   return mask(email, true)
// }

// console.log(mask("test@gmail.com"));
// console.log(unmask("Δ΅ΓΔ@·΍΁ΉΌ.com"));
