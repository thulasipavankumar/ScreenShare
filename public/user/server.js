const conf = require("./conf");
const serverSocket = new WebSocket("wss://"+path);
const path = conf.server_address;
const axios = require("axios");



axios.post(path, {
    key: conf.secret,
    session_name:conf.session_name
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });