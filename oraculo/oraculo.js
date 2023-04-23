require("dotenv").config()
const { request } = require("express")
const Web3 = require('web3')
const oracleAbi = require('./abi/Oracle.json')
const retorno = require('./retorno')

const direcciones = require('./extras/direcciones.json')
const HDWalletProvider = require("@truffle/hdwallet-provider")

// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ADDRESS));
// const web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545"));
const provider = new HDWalletProvider({
  privateKeys: [process.env.PRIVATE_KEY],
  providerOrUrl: process.env.WEB3_PROVIDER_ADDRESS
});
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_ADDRESS))


const abi = oracleAbi.abi;  //JSON.parse(process.env.ABI);
var contract

const account = () => {
  return process.env.ACCOUNT;
};

exports.init = async () => {
  contract = new web3.eth.Contract(abi, getContractAddress())
  console.log("Se creo conexión con contrato")
  newRequest(contract)
  updatedRequest(contract)
  return contract
}

const newRequest = (contract) => {
  let optionsNotification = {
    fromBlock: 'latest'
  };

  contract.events.NewRequest(optionsNotification)
    .on('data', async event => {
      try {
        console.log('Notificacion new request: ', event.returnValues)

        let response = await retorno.responder(event.returnValues)
        console.table(response)

        if (response != null) {
          this.updateRequest(event.returnValues.id, response)
        }
      } catch (error) {
        console.error("Fallo en el sistema: ", error)
      }
    })
    .on('error', err => {
      console.log("Ocurrio una notificación de error, changed")
      console.log(err)
    })

};

const updatedRequest = (contract) => {
  let optionsNotification = {
    fromBlock: 'latest'
  };

  contract.events.UpdatedRequest(optionsNotification)
    .on('data', event => {
      console.log('Notificacion updated request: ', event.returnValues)
    })
    .on('error', err => {
      console.error("f se rompio changed")
      console.error(err)
    })
};

exports.createRequest = (
  urlToQuery,
  attributeToFetch,
  interested,
  cause
) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (urlToQuery == undefined || attributeToFetch == undefined || interested == undefined || cause == undefined) {
        console.error("Solicitud invalida")
        reject("Error, solicitud invalida")
      }

      console.log("New request:" + urlToQuery + " - " + attributeToFetch)

      let nonce = await web3.eth.getTransactionCount(account());
      console.log('Nonce:', nonce);

      let contractMethod = contract.methods.createRequest(urlToQuery, attributeToFetch, interested, cause);
      let functionAbi = contractMethod.encodeABI();

      let txObject = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(6000000),
        to: getContractAddress(),
        data: functionAbi
      };

      let signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);

      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, res) {
        if (!error) {
          console.log('Transaction hash:', res);
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
  valueRetrieved
) => {
  try {
    console.log('Update request: ' + valueRetrieved)
    let nonce = await web3.eth.getTransactionCount(account());

    let response = [
      valueRetrieved.identificacion,
      valueRetrieved.nombre,
      valueRetrieved.apellido,
      valueRetrieved.especialidad,
      valueRetrieved.activo.toString()
    ]
    console.table(response)

    let contractMethod = contract.methods.updateRequest(id, response)
    let functionAbi = contractMethod.encodeABI();
    let txObject = {
      nonce: web3.utils.toHex(nonce),
      gasLimit: web3.utils.toHex(6000000),
      to: getContractAddress(),
      data: functionAbi
    };

    let signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, res) {
      if (!error) {
        console.log('Transaction hash:', res);
      } else {
        console.error('Error:', error);
      }
    })

  } catch (error) {
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



const getContractAddress = () => {
  // console.log(direcciones)
  let result = direcciones.find(element => element.contrato == 'oracle')
  if (result == undefined) {
    console.error("Fallo al conectar con blockchain, revise la dirección del contrato ", contractName)
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