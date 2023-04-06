require("dotenv").config();
const { request } = require("express");
const Web3 = require('web3');
const oracleAbi = require('./abi/Oracle.json')
const retorno = require('./retorno')

const direcciones = require('./extras/direcciones.json')

// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_ADDRESS));
// const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_ADDRESS));

// const web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:7545"));
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WEB3_PROVIDER_ADDRESS));


const abi = oracleAbi.abi;  //JSON.parse(process.env.ABI);
// const address = process.env.CONTRACT_ADDRESS;
// const address = getContractAddress()
// "0x718c7e587192465270CB57BC0a7fC7f4dD6374E8"
// const version = web3.version.api;
var contract

exports.init = async () => {
  contract = new web3.eth.Contract(
    abi,
    getContractAddress(),
    {
      gasPrice: '20000000000'
    });


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
      //console.log(event)
      try {
        console.log('Notificacion new request: ', event.returnValues);

        let response = await retorno.responder(event.returnValues);
        console.table(response)
        if (response != null) {
          this.updateRequest(event.returnValues.id, response)
        }
      } catch (error) {
        console.error("Fallo en el sistema: ", error)
      }
    })
    .on('error', err => {
      console.log("f se rompio changed")
      console.log(err)
    })

};

const updatedRequest = (contract) => {
  let optionsNotification = {
    fromBlock: 'latest'
  };

  contract.events.UpdatedRequest(optionsNotification)
    .on('data', event => {
      //console.log(event)
      console.log('Notificacion updated request: ', event.returnValues);
      //retorno.responder(event.returnValues);

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
  return new Promise((resolve, reject) => {
    account().then(account => {
      console.log("new request:" + urlToQuery + " - " + attributeToFetch)
      contract.methods.createRequest(urlToQuery, attributeToFetch, interested, cause).send({
        from: account,
        gas: 6000000
      }, (err, res) => {
        if (err === null) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    }).catch(error => reject(error));
  });
};


/*exports.updateRequest = (
  id,
  valueRetrieved
) => {
  console.log('-----update request: '+ valueRetrieved)
  return new Promise((resolve, reject) => {
    account().then(account => {
      contract.methods.updateRequest(id, valueRetrieved).send({
        from: account,
        gas: 6000000
      }, (err, res) => {
        if (err === null) {
          console.log('responde')
          console.log(res)
          resolve(res);
        } else {
          console.log('error')
          reject(err);
        }
      });
    }).catch(error => {
      console.log('error');
      reject(error)
    })
  });
};*/

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
    let txObject = {
      from: accountValue,
      gas: 6000000
    }
    const signedTx = await web3.eth.accounts.signTransaction(txObject, process.env.PRIVATE_KEY);
    await contract.methods.updateRequest(id, response).send(signedTx.rawTransaction, (err, res) => {
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

const account = () => {
  console.log(process.env.ACCOUNT)
  return process.env.ACCOUNT;
};

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