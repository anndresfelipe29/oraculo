
//import contrato from "./oraculo.js"
const express = require('express')
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3001


const usuarios = require('./usuarios')
//  const ejemplo = require('./eventos')

app.get('/buscar-usuario', (req, res) => {
  try {
    let identificacion = req.query.identificacion;
    
    respuesta = usuarios.validarUsuario(parseInt(identificacion))
    if(respuesta == undefined){
      res.status(404).send({response: 'Not found'})
    }
    res.send(respuesta)
    res.status(200)

  } catch(err) {
    res.status(500).send({response: 'Internal server error'})
  }
    
})

app.get('/validar-usuario', (req, res) => {
  try {
    let identificacion = req.query.identificacion;
    let contrasena = req.query.contrasena;
    
    respuesta = usuarios.validarUsuario(parseInt(identificacion))
    if(respuesta == undefined){
      res.status(404).send({response: 'Not found'});
      
    }
    if(respuesta.identificacion != contrasena) {
      res.status(403).send({response: 'Fail data'});
      
    }
    res.send(respuesta)
    res.status(200)    

  } catch(err) {
    res.status(500).send({response: 'Internal server error'})
  }
    
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  usuarios.cargarUsuarios()
})
