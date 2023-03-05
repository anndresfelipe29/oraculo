const request = require('request');

exports.callApi = async (url, methodRequest) => {
  return new Promise((resolve, reject) => {
    let requestOptions = {
      uri: url,
      method: methodRequest,
      //uri: 'http://localhost:3001/validar-usuario?identificacion=1004',
      /*qs: {
        identificacion: '1001',          
      }*/
    }
    try {
      request(requestOptions, (err, response, body) => {
          if (err === null) {
              console.log(response.statusCode)
              if(response.statusCode == 200) {
                resolve(response.body)
              }
              console.log(response.body)
              reject("Invalid status");
              //console.log(body)
            } else {
              console.log(err);
              reject(err);
            }
        })
    } catch (error) {
      console.error("se murio:", error )
    }

    })
};