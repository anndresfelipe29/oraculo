
//import contrato from "./oraculo.js"
const express = require('express')
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const utils = require('./utils')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3000


const oraculo = require('./oraculo')
const ejemplo = require('./eventos')

app.get('/', async (req, res) => {
  try {
    let url = req.query.url;
    let method = req.query.method;
    let interested = req.query.interested;
    let cause = req.query.cause;
    await oraculo.createRequest(url, method, interested, cause)
    res.status(200)
    res.send('Hello World!')
    
  } catch (error) {
    console.error(utils.dateNow(), "Se produjo un error:", error)
    res.status(500).send({error: "Petición invalida"})
  }
})

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  console.log("=======================Cargando oraculo================")
  x = oraculo.init()
  //ejemplo.ejemplo()
})


/*var http = require('http');
var server = http.createServer();

function mensaje(petic, resp) {
	resp.writeHead(200, {'content-type': 'text/plain'});
	resp.write('Hola Mundo');
	resp.end();
}

server.on('request', mensaje);

server.listen(3000, function () {
  	console.log('La Aplicación está funcionando en el puerto 3000');
});

console.log("sigue")
*/


