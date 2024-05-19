const sqlite3 = require("sqlite3").verbose();
const path = require('path');

class ContactosModel{
    constructor(){
      this.db = new sqlite3.Database(path.join(__dirname, "/database", "database.db"), (err) => {
        if(err){
          console.log('Error');
        }
        console.log('Database created successfully')
      });
    }
  
    conectar(){
      this.db.run('CREATE TABLE IF NOT EXISTS contactos(name VARCHAR(255), email VARCHAR(255), commentary TEXT,ip TEXT,date TEXT)');
  }
    
    guardar(nombre,correo,comentario,ip,fecha){
      this.db.run("INSERT INTO contactos VALUES (?, ?, ?, ?, ?)", [nombre, correo, comentario, ip, fecha]);
    }
  
  }
  
  
class ContactosController{
    constructor(){
      this.model = new ContactosModel();
      this.model.conectar();
    }
  
    save(req,res){
      const { firstname, lastname, subject} = req.body;
      const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
      let hoy = new Date();
      let horas = hoy.getHours();
      let minutos = hoy.getMinutes();
      let hora = horas + ':' + minutos;
      let fecha = hoy.getDate() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getFullYear() + '' + '/' + '' + hora;
      this.model.guardar(firstname,lastname,subject,ip,fecha);
      res.send('Contact save successfully')
    }
  }
  

module.exports = ContactosController