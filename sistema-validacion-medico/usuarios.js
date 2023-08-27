const { Console } = require('console');
const Medico = require('./Medico')
const fs = require('fs');
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

exports.validarUsuarioDeArchivo = (identificacion, nombreArchivo) => {
    let usuarios = this.cargarUsuariosDeArchivo(nombreArchivo)
    let respuesta = usuarios[identificacion]
    console.log(respuesta)
    //console.log(usuarios.size)
    return respuesta

}


exports.cargarUsuariosDeArchivo = (nombreArchivo) => {
    try {
        let value = leerArchivoJSON(nombreArchivo)
        console.log(value)
        return value
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        throw { "code": 500, "msg": "Error al leer el archivo" }
    }
}

async function escribirArchivoJSON(nombreArchivo, jsonData) {
    try {
        await fs.writeFileSync(nombreArchivo, JSON.stringify(jsonData, null, 2));
        console.log('Archivo JSON actualizado correctamente.');
    } catch (error) {
        throw { "code": 500, "msg": "error" }
    }
}

function leerArchivoJSON(nombreArchivo) {
    try {
        const data = fs.readFileSync(nombreArchivo, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        throw error;
    }
}

exports.actualizacion = (nuevoValor, nombreArchivo) => {

    const jsonData = leerArchivoJSON(nombreArchivo);

    // Modificar el objeto JSON
    console.log(nuevoValor.identificacion)

    if (jsonData[nuevoValor.identificacion] != undefined) {
        console.log("el valor ya existe")
        throw { "code": 400, "msg": "El valor ya existe" }
    } else {
        jsonData[nuevoValor.identificacion] = nuevoValor;
        console.log("el valor")
        //console.log(jsonData)
        escribirArchivoJSON(nombreArchivo, jsonData);
    }

}