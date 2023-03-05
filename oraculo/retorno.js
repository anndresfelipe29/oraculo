
const comunicadorAppExterna = require('./comunicadorAppExterna')
const oraculo = require('./oraculo')

exports.responder = async (values) => {
    //console.log(values)
    console.log("entra a responder")
    let response
    try {
        let info = await comunicadorAppExterna.callApi(values.urlToQuery, values.attributeToFetch)
        response = JSON.parse(info)
        console.table(info)
    } catch (error) {
        console.error("Se rompio en retorno.responder")
        response = null
    }
    
    return response
}