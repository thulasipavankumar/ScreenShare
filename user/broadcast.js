var log4js = require("log4js");
var logger = log4js.getLogger("broadcast");
logger.level = "debug";
const conf = require("../conf").dev;

const path = conf.server_address;
const axios = require("axios");
const screenshot = require('screenshot-desktop');
//const websocketEndPoint = conf.ws_protocol+conf.raw+"/"+conf.session_name;
const websocketEndPoint = conf.ws_protocol+conf.raw+"/";
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
    .then( response => {
        if(validate({status:response.status,data:response.data})){
            // extract the url from the response 
            start_broadcast(response.data.url)
        }
    logger.warn(`Validation failed skipping broadcast`)
    })
    .catch(function (error) {
        logger.error(`error in post ${error} , ${JSON.stringify(error)}`);
    });
const validate = ({status,data}) => {
  // check the response if name is take throw error
 if(status<200||status>299){
  logger.fatal(`The session name is already taken please try a new name \n 
                Or set value as random to set random server name`);
  return false;
 }
   return true;
}
const start_broadcast = (url) => {
    const serverSocket = new WebSocket(url);
        logger.debug(`Share this url with your guests:${url} along with your secret`)
        setInterval(function(){
            repeat(serverSocket)
        }, 300); 
}