const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passwordValidator = require('password-validator');
const schema = new passwordValidator();

// Propriétés requises
schema
.is().min(8)                                    // Minimum 8 lettres
.is().max(100)                                  // Maximum 100 lettres
.has().uppercase()                              // Doit avoir une lettre majuscule
.has().lowercase()                              // Doit avoir une lettre minuscule
.has().digits(1)                                // Doit avoir minimum un chiffre
.has().not().spaces()                           // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de ces mots de passe

// Valider à nouveau le mot de passe
console.log(schema.validate('validPASS123'));

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
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
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};