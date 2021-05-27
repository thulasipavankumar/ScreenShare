var log4js = require("log4js");
var logger = log4js.getLogger("broadcast");
logger.level = "debug";
const conf = require("./conf").dev;

const path = conf.server_address;
const axios = require("axios");
const screenshot = require('screenshot-desktop');
const websocketEndPoint = conf.ws_protocol+conf.raw+"/"+conf.session_name;
const WebSocket = require('ws');

const repeat = (serverSocket) => {
   
    screenshot({ format: 'jpg' }).then((img) => {
        
         let buff = new Buffer(img);
         let base64data = buff.toString('base64');
         let jsonMsg = {};
         
         jsonMsg.image = base64data;
         if(serverSocket.readyState==1)
            serverSocket.send(JSON.stringify(jsonMsg));
     }).catch((err) => {
         logger.error(`error in screenshot function ${err} , ${JSON.stringify(err)}`)
        
     })    
}

axios.post(path, {
    key: conf.secret,
    session_name: conf.session_name
})
    .then(function (response) {
        const serverSocket = new WebSocket("" + websocketEndPoint);
        logger.debug("Share this url with your guests:", conf.server+conf.session_name)
        setInterval(function(){
            repeat(serverSocket)
        }, 300); 

    })
    .catch(function (error) {
        logger.error(`error in post ${error} , ${JSON.stringify(error)}`);
    });