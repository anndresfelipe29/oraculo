require("dotenv").config()
const { request } = require("express")
const Web3 = require('web3')
const oracleAbi = require('./abi/Oracle.json')
const retorno = require('./retorno')

const direcciones = require('./extras/direcciones.json')

// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ADDRESS));
// const web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545"));

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_ADDRESS))


const abi = oracleAbi.abi;  //JSON.parse(process.env.ABI);
var contracto

const account = () => {
  return process.env.ACCOUNT;
};

exports.init = async () => {
  contracto = new web3.eth.Contract(abi, obtenerDireccionDeContrato())
  console.log("Se creo conexión con contrato")
  newRequest(contracto)
  updatedRequest(contracto)
  return contracto
}

const newRequest = (contracto) => {
  let opcionesDeNotificacion = {
    fromBlock: 'latest'
  };

  contracto.events.NewRequest(opcionesDeNotificacion)
    .on('data', async evento => {
      try {
        console.log('Notificacion new request: ', evento.returnValues)

        let respuesta = await retorno.responder(evento.returnValues)
        console.table(respuesta)

        if (respuesta != null) {
          await this.updateRequest(evento.returnValues.id, respuesta)
        }
      } catch (error) {
        console.error("Fallo en el sistema: ", error)
      }
    })
    .on('error', error => {
      console.log("Ocurrio una notificación de error, changed")
      console.log(error)
    })

};

const updatedRequest = (contracto) => {
  let opcionesDeNotificacion = {
    fromBlock: 'latest'
  };

  contracto.events.UpdatedRequest(opcionesDeNotificacion)
    .on('data', evento => {
      console.log('Notificación updated request: ', evento.returnValues)
    })
    .on('error', error => {
      console.error("Ocurrio una notificación de error, changed")
      console.error(error)
    })
};

exports.createRequest = (
  urlAConsultar,
  metodoDeConsulta,
  interesado,
  causa
) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (urlAConsultar == undefined || metodoDeConsulta == undefined || interesado == undefined || causa == undefined) {
        console.error("Solicitud invalida")
        reject("Error, solicitud invalida")
      }

      console.log("New request:" + urlAConsultar + " - " + metodoDeConsulta)

      let nonce = await web3.eth.getTransactionCount(account());

      let metodoDelContrato = contracto.methods.createRequest(urlAConsultar, metodoDeConsulta, interesado, causa);
      let funcionEnCodigoAbi = metodoDelContrato.encodeABI();

      let objetoDeTransaccion = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(6000000),
        to: obtenerDireccionDeContrato(),
        data: funcionEnCodigoAbi
      };

      let transaccionFirmada = await web3.eth.accounts.signTransaction(objetoDeTransaccion, process.env.PRIVATE_KEY);

      web3.eth.sendSignedTransaction(transaccionFirmada.rawTransaction, function (error, res) {
        if (!error) {
          console.log('Hash de transacción:', res);
          resolve(res);
        } else {
          console.error('Error:', error);
          reject(err);
        }
      })

    } catch (error) {
      reject(error);
    }
  });
};


exports.updateRequest = async (
  id,
  valorRecibido
) => {
  try {
    console.log('Update request: ' + valorRecibido)
    let nonce = await web3.eth.getTransactionCount(account());

    let cuerpoDeSolicitud = [
      valorRecibido.identificacion,
      valorRecibido.nombre,
      valorRecibido.apellido,
      valorRecibido.especialidad,
      valorRecibido.activo.toString()
    ]
    console.table(cuerpoDeSolicitud)

    let metodoDelContrato = contracto.methods.updateRequest(id, cuerpoDeSolicitud)
    let funcionEnCodigoAbi = metodoDelContrato.encodeABI();
    let objetoDeTransaccion = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(6000000),
      to: obtenerDireccionDeContrato(),
      data: funcionEnCodigoAbi
    };

    console.log("Private key")
    console.log(process.env.PRIVATE_KEY)
    let transaccionFirmada = await web3.eth.accounts.signTransaction(objetoDeTransaccion, process.env.PRIVATE_KEY);

    await web3.eth.sendSignedTransaction(transaccionFirmada.rawTransaction, function (error, res) {
      if (!error) {
        console.log('Transaction hash:', res);
      } else {
        console.error('Error:', error);
      }
    })

  } catch (error) {
    console.error("Fallo la transacción")
    reject(error);
  }


};


/*const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err === null) {
        //resolve(accounts[process.env.ACCOUNT_NUMBER]);
        console.log('Cuenta: ', accounts[7])
        resolve(accounts[7]);
      } else {
        console.error("Error al obtener cuentas blockchain")
        reject(err);
      }
    });
  });
};*/



const obtenerDireccionDeContrato = () => {
  // console.log(direcciones)
  let result = direcciones.find(elemento => elemento.contrato == 'oracle')
  if (result == undefined) {
    console.error("Fallo al conectar con blockchain, revise la dirección del contrato ", nombreDeContrato)
    return null
  }
  // console.log(result)
  return result.direccion
}

/* 
Otra forma de enviar transaciones (Sin firmar)
exports.updateRequest = async (
  id,
  valueRetrieved
) => {
  console.log('Update request: ' + valueRetrieved)
  let accountValue = await account()
  console.warn('Cuenta: ', accountValue)

  let response = [
    valueRetrieved.identificacion,
    valueRetrieved.nombre,
    valueRetrieved.apellido,
    valueRetrieved.especialidad,
    valueRetrieved.activo.toString()
  ]
  console.table(response)

  try {
    await contract.methods.updateRequest(id, response).send({
      from: accountValue,
      gas: 6000000
    }, (err, res) => {
      if (err === null) {
        console.log('Transacción ok')
      } else {
        console.error('error:', err)
      }
    });
  } catch (error) {
    console.log("Se presento el siguiente error:")
    console.error(error)
  }
};
*/ 