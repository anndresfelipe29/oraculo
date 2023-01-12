const Medico = require('./Medico')
const usuarios = new Map();

exports.cargarUsuarios = () => {
    usuarios.set(1000, {
        identificacion: "1000", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: true
     })
    usuarios.set(1001, {
        identificacion: "1001", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: true
     })
    usuarios.set(1002, {
        identificacion: "1002", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: true
     })
    usuarios.set(1003, {
        identificacion: "1003", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: true
     })
    usuarios.set(1004, {
        identificacion: "1004", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: false
     })
    usuarios.set(1005, {
        identificacion: "1005", 
        nombre: "Pipe",
        apellido: "Gómez",
        especialidad: "Gastroenterologo",
        activo: true
     })

}

exports.validarUsuario = (identificacion) => {
    respuesta = usuarios.get(identificacion)
    console.log(respuesta)
    //console.log(usuarios.size)
    return respuesta
    
}