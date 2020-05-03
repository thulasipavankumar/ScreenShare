const conf = require("./conf");

const path = conf.server_address;
const axios = require("axios");
const screenshot = require('screenshot-desktop');



axios.post(path, {
    key: conf.secret,
    session_name: conf.session_name
})
    .then(function (response) {
        const serverSocket = new WebSocket("wss://" + path);
        screenshot({ format: 'jpg' }).then((img) => {
            console.log("created  new  room: " + pathname)	                // img: Buffer filled with jpg goodness
            // ...
            let buff = new Buffer(img);
            let base64data = buff.toString('base64');
            let jsonMsg = {};
            jsonMsg.message = data;
            jsonMsg.origin = ws.origin;
            jsonMsg.image = base64data;
            ws.send(JSON.stringify(jsonMsg));
        }).catch((err) => {
            console.log("error in promise", err)
            // ...
        })

    })
    .catch(function (error) {
        console.log(error);
    });