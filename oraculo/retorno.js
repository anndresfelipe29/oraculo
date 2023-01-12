
const comunicadorAppExterna = require('./comunicadorAppExterna')
const oraculo = require('./oraculo')

exports.responder = async (values) => {
    //console.log(values)
    console.log("entra a responder")
    try {
        let response = await comunicadorAppExterna.callApi(values.urlToQuery, values.attributeToFetch)
        
        oraculo.updateRequest(values.id, JSON.parse(response))
        // guardar info en blockchain
        console.log("voy a responder")  
    } catch (error) {
        console.error("Se rompio en retorno.responder")
    }

}