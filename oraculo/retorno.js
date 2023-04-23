
const comunicadorAppExterna = require('./comunicadorAppExterna')
const oraculo = require('./oraculo')

exports.responder = async (values) => {
    console.log(dateNow(), "Inicia interacción con el sistema externo")
    let respuesta
    try {
        let respuestaExterna = await comunicadorAppExterna.llamarApi(values.urlToQuery, values.attributeToFetch)
        respuesta = JSON.parse(respuestaExterna)
        console.table(respuestaExterna)
    } catch (error) {
        console.error(dateNow(), "La respuesta fue una promesa fallida")
        respuesta = null
    }
    
    return respuesta
}