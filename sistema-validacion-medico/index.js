
//import contrato from "./oraculo.js"
const express = require('express')
const Joi = require('joi');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3001


const usuarios = require('./usuarios')
const Medico = require('./Medico')
//  const ejemplo = require('./eventos')

app.get('/buscar-usuario', (req, res) => {
  try {
    let identificacion = req.query.identificacion;
    
    let respuesta = usuarios.validarUsuarioDeArchivo(parseInt(identificacion), "usuarios.json")
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
    
    let respuesta = usuarios.validarUsuarioDeArchivo(parseInt(identificacion), "usuarios.json")
    if(respuesta == undefined){
      res.status(404).json({response: 'Not found'});
      return
    }
    if(respuesta.identificacion != contrasena) {
      res.status(403).json({response: 'Fail data'});
      return
    }
    res.json(respuesta)
    res.status(200)    

  } catch(err) {
    console.log(err)
    res.status(500).json({response: 'Internal server error'})
  }
    
})

app.post('/crear-usuario', (req, res) => {
  try {
    const medicoSchema = Joi.object({
      identificacion: Joi.string().required(),
      nombre: Joi.string().required(),
      apellido: Joi.string().required(),
      especialidad: Joi.string().required(),
      activo: Joi.boolean().required(),
    });
  
    const { error } = medicoSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({response: error.details[0].message});
    }
    const nuevoMedico = new Medico(
      req.body.identificacion,
      req.body.nombre,
      req.body.apellido,
      req.body.especialidad,
      req.body.activo
    );

    usuarios.actualizacion(nuevoMedico, "usuarios.json")

    res.status(201).json({ message: 'Medico creado correctamente' });

  } catch(err) {
    console.error(err)
    res.status(err.code).send({response: err.msg})
  }
    
})


app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  //usuarios.cargarUsuarios()
})
