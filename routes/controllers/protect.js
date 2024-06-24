
const passport = require('passport');
require('dotenv').config();


exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login')
    }
}

exports.isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/contactos');
    } else {
        return next();
    }
}

exports.login = passport.authenticate('local', {
    successRedirect: '/contactos',
    failureRedirect: '/login'
})

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
}

