const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();




class ContactosModel {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, "/database", "database.db"), (err) => {
      if (err) {
        console.log('Error');
      }
      console.log('Database created successfully')
    });
  }

  conectar() {
    this.db.run('CREATE TABLE IF NOT EXISTS contactos(name VARCHAR(255), email VARCHAR(255), commentary TEXT,ip TEXT,date TEXT,country TEXT)');
  }

  guardar(nombre, correo, comentario, ip, fecha, pais) {
    this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?, ?)", [nombre, correo, comentario, ip, fecha, pais]);
  }

}


class ContactosController {
  constructor() {
    this.model = new ContactosModel();
    this.model.conectar();
  }

  async save(req, res) {
    const { firstname, lastname, subject } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    let hoy = new Date();
    let horas = hoy.getHours();
    let fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + horas;

    const response_key = req.body["g-recaptcha-response"];
    const secret_key = process.env.RECAPTCHAPRIVATE;
    const url =`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    const urlPais = 'http://ipwho.is/' + ip
    const urlPaisFetch = await fetch(urlPais)
    const jsonUrlPais = await urlPaisFetch.json();
    const pais = jsonUrlPais.country;


    fetch(url, {
      method: "post",
    })
      .then((response) => response.json())
      .then((google_response) => {
        console.log(google_response)
        if (google_response.success == true) {


          // Import the Nodemailer library


          // Create a transporter object
          const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secureConnection: false, // use SSL
            auth: {
              user: process.env.CORREO,
              pass: process.env.CONTRASENA,
            },
            debug: true
          });

          // Configure the mailoptions object
          const mailOptions = {
            from: process.env.CORREO,
            to: 'programacion2ais@dispostable.com',
            subject: 'Contact information',
            html: `
                   <h1>Welcome!</h1>
                   <p>Nombre: ${firstname}</p>
                   <p>Correo: ${lastname}</p>
                   <p>Fecha/Hora: ${fecha}</p>
                   <p>Pais: ${pais}</p>
                   <p>Ip: ${ip}</p>`
          };

          // Send the email
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              this.model.guardar(firstname, lastname, subject, ip, fecha, pais);
              return res.send({ response: "Contact save and email successfully" });
            }
          });
        } else {
          return res.send({ response: "Failed captcha" });
        }
      })
      .catch((error) => {
        // Some error while verify captcha
        return res.json({ error });
      });





  }
}


module.exports = ContactosController
