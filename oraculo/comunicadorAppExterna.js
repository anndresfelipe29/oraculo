const request = require('request');

exports.llamarApi = async (url, metodoDeConsulta) => {
  return new Promise((resolve, reject) => {
    let opcionesDePeticion = {
      uri: url,
      method: metodoDeConsulta
    }
    try {
      request(opcionesDePeticion, (error, respuesta, body) => {
          if (error === null) {
              console.log(respuesta.statusCode)
              if(respuesta.statusCode == 200) {
                resolve(respuesta.body)
              }
              console.log(respuesta.body)
              reject("Invalid status");
              //console.log(body)
            } else {
              console.log(error);
              reject(error);
            }
        })
    } catch (error) {
      console.error(dateNow(), "Fallo en la petición:", error )
      reject(error)
    }

    })
};