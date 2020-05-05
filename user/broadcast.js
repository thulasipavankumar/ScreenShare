const conf = require("./conf").dev;

const path = conf.server_address;
const axios = require("axios");
const screenshot = require('screenshot-desktop');
const websocketEndPoint = conf.ws_protocol+conf.raw+"/"+conf.session_name;
const WebSocket = require('ws');

const repeat = (serverSocket) => {
    /* do what ever you want but call executor once you are done with everything */
    screenshot({ format: 'jpg' }).then((img) => {
        // console.log("created  new  room: " + pathname)	                // img: Buffer filled with jpg goodness
         // ...
         let buff = new Buffer(img);
         let base64data = buff.toString('base64');
         let jsonMsg = {};
         
         jsonMsg.image = base64data;
         serverSocket.send(JSON.stringify(jsonMsg));
     }).catch((err) => {
         console.log("error in promise", err)
         // ...
     })    
}
axios.post(path, {
    key: conf.secret,
    session_name: conf.session_name
})
    .then(function (response) {
        const serverSocket = new WebSocket("" + websocketEndPoint);
        setInterval(function(){
            repeat(serverSocket)
        }, 300); 

    })
    .catch(function (error) {
        console.log(error);
    });