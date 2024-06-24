require('dotenv').config();
var express = require('express');
var router = express.Router();
const passport = require('passport');
const protect = require('./controllers/protect');
const ContactosController = require('./controllers/models');

const miControlador = new ContactosController();



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    GOOGLEPUBLIC: process.env.RECAPTCHAPUBLIC
  });
});

router.get('/login', protect.isNotAuthenticated,
  (req, res) => { res.render('login') })

router.post('/login', protect.login);

router.get('/contactos', protect.ensureAuthenticated, async (req, res) => {
  const { username, email } = req.user;
  const data = await miControlador.model.getContacts();
  const request = username || email;
  res.render('contactos',{
    data: data,
    request: request
  })
});

router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', 
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect('/contactos');
  }
);




router.get('/logout', (req, res) => protect.logout(req, res));
router.post('/send', (req, res, next) => miControlador.save(req, res))
module.exports = router;
