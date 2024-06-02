var express = require('express');
var router = express.Router();
const ContactosController = require('./controllers/models'); 
require('dotenv').config()
const miControlador = new ContactosController();






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', GP: process.env.RECAPTCHAPUBLIC });
});


router.post('/send',(req,res,next) => miControlador.save(req,res))

module.exports = router;
