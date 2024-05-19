var express = require('express');
var router = express.Router();
const ContactosController = require('./controllers/models'); 

const miControlador = new ContactosController();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/send',(req,res,next) => miControlador.save(req,res))

module.exports = router;
