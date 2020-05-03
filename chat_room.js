const WebSocket = require('ws');
const screenshot = require('screenshot-desktop');
           
class chat_room {
  roomName;
  availableUsers = [];
  wss;
  constructor(roomName) {
    console.log("constructor for new room ", roomName)
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
  addUserToTheExsistingList = (user) => {
    this.availableUsers.push(user);
  }
  getMasterConnection = () => this.wss;
  getChatRoomName = () => this.roomName;
  getAllUsers = () => this.availableUsers;
  deleteUserFromList = (userData) => {
    // pending 
  }
  clientOnOpen = () => {
    console.log("opened a new connection");
  }
  print = data => {
    console.log(data);
  }
  clientOnError = errData => {
    console.log("error in ws", errData)
  }
  clientOnMessage = (data) => {
    //https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
    let jsonMsg = JSON.parse(data);
    if (jsonMsg.message !== undefined)
      this.sendMsgToAllUsers(jsonMsg.message);
    else
      this.sendMsgToAllUsers(jsonMsg);
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
  removeStaleUsersFromTheList = () => {
    this.availableUsers = this.availableUsers.filter(user => (user.readyState === 0 || user.readyState === 1));
  }

  clientOnClose = (closingCode, reason) => {

    //https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    console.log("closed in ws:" + closingCode + "," + reason);
    //delete user from the list
    this.sendMsgToAllUsers("A user disconnected ")
  }
}
module.exports = chat_room;