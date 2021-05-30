const WebSocket = require('ws');
const screenshot = require('screenshot-desktop');
var log4js = require("log4js");
var logger = log4js.getLogger("chat_room");
logger.level = "debug";          
class chat_room {
  roomName;
  availableUsers = [];
  wss;
  constructor(roomName) {
    
    if(this.is_string_null_or_empty(roomName))
      throw new Error("room name cannot be empty")
    if(!this.is_object_string(roomName))
    throw new Error("room name must be string type")
    logger.debug("constructor for new room ", roomName)
    //https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    this.roomName = roomName;
    this.wss = new WebSocket.Server({ noServer: true });
    this.wss.on('connection', ws => {
      ws.on('open', this.clientOnOpen);
      ws.on('error', this.clientOnError);
      ws.on('close', this.clientOnClose);
      ws.on('message', this.clientOnMessage);
      this.addUserToTheExsistingList(ws)
    })
  }
  is_string_null_or_empty = str => (str===undefined||str.length===0)
  is_object_string = val => (typeof val === 'string' || val instanceof String)
  addUserToTheExsistingList = (user) => {
    this.availableUsers.push(user);
  }
  getMasterConnection = () => this.wss;
  getChatRoomName = () => this.roomName;
  getAllUsers = () => this.availableUsers;
  deleteUserFromList = (userData) => {
    try{
      delete this.availableUsers[this.availableUsers.findIndex(ele => ele ===userData)]
    }catch(e){
      logger.error(`unable to delete ${userData} from the user list: ${e} , ${JSON.stringify(e)}`)
    }
  }
  clientOnOpen = () => {
    logger.debug("opened a new connection");
  }
  print = data => {
    logger.debug(data);
  }
  clientOnError = errData => {
    logger.fatal(`error in websocker ${errData} , ${JSON.stringify(errData)} ` );
  }
  clientOnMessage = (data) => {
    //https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    // let jsonMsg = JSON.parse(data);
    // if (jsonMsg.message !== undefined)
    //   this.sendMsgToAllUsers(jsonMsg.message);
    // else
    //   this.sendMsgToAllUsers(jsonMsg);
    this.sendRawMsgToAllUsers(data);
  }
  sendMsgToAllUsers = (data) => {
    this.removeStaleUsersFromTheList();
    this.availableUsers.map(client => {
      let jsonMsg = {};
      jsonMsg.message = data;
      jsonMsg.origin = client.origin;
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonMsg));
      }
    })
  }
  sendRawMsgToAllUsers = (data) => {
    this.removeStaleUsersFromTheList();
    this.availableUsers.map(client => {
      let jsonMsg = JSON.parse(data);
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(jsonMsg));
      }
    })
  }
  removeStaleUsersFromTheList = () => {
    this.availableUsers = this.availableUsers.filter(user => (user.readyState === 0 || user.readyState === 1));
   // logger.debug("after removing stale users count: "+this.availableUsers.length);
  }

  clientOnClose = (closingCode, reason) => {

    //https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    logger.debug("closed in ws:" + closingCode + "," + reason);
    //delete user from the list
    this.sendMsgToAllUsers("A user disconnected ")
  }
}
module.exports = chat_room;