
const express = require('express')
const session = require('express-session');
const http = require('http')
const WebSocket = require('ws')
const chat_room = require('./chat_room');
const url = require('url');
const uuid = require('uuid');
const port = process.env.PORT || 8080
const app = express()
var server = require('http').createServer(app);
app.use(express.static(__dirname + '/public'));
server.listen(port);
let avialbleChatrooms = {};
const sessionParser = session({
    saveUninitialized: false,
    resave: false
  });
  app.use(sessionParser);  
app.get('/', (req, res) => {
   
    res.sendFile(__dirname + '/public/html/screen.html');
})
app.get(/pavan/, function (req, res) {
    console.log(req.originalUrl);
    res.sendFile(__dirname + '/public/html/screen.html');
  })
app.get('/session',(req,res)=>{
    const id = uuid.v4();
    console.log(`Updating session for user ${id}`);
    req.session.userId = id;
    res.send({ result: 'OK', message: 'Session updated' });
})

app.post('/createSession', function (req, res) {
    if(req.data.key!=="pavan"){
        res.sendStatus(401);
        return;
    }
    createAPrivateChatRoom(req.data.session_name);
    res.sendStatus(201);
})

const createAPrivateChatRoom = (roomName) => {
    //ceate and return a new chat room;
    //let r = Math.random().toString(36).substring(7);
    // console.log("random", r);
    // let newChatRoomName =  addRoomToGivenName(roomName);
    let chatRoomObj = new chat_room(roomName);
    avialbleChatrooms[roomName] = chatRoomObj
    return chatRoomObj;
}
const doesChatRoomExsists = roomName => {
    return (map.get(roomName)!==undefined)
}
const addRoomToGivenName = name => "room" + name;

const addUserToTheExsistingChatRoom = (user, chatRoom) => {
    //chatRoom.addUserToTheExsistingList(user);
}
const removeUserFromChatRoom = (user, chatRoom) => {
    //chatRoom.remove(user);
}
const sendMessageToAllUsers = (users, msg) => {
    users.map(user => {
        //user.send(msg)
    })
}
const sendMessageToWholeChatRoom = (chatRoom, msg) => {
    getUsersFromChatRoom(chatRoom).map(user => {
        //user.send(msg);
    })
}
const getUsersFromChatRoom = (chatRoom) => chatRoom.getUsers();

const addConnectionToExsistingRoom = (roomName) => {
    if (doesChatRoomExsists(roomName)) {
        return avialbleChatrooms[roomName];
    } else {
        return createAPrivateChatRoom(pathname);
    }
}
const addUserToChatRoom = () => {

}
const authenticate = () => {
    //change for production push
    //request.headers.host.includes("localhost")
    return true;
}

server.on('upgrade', function upgrade(request, socket, head) {
    try {
        const pathname = url.parse(request.url).pathname.substr(1);
        if (!authenticate(request)) {
            console.log("destorying the socket")
            socket.destroy();
        }
        else {
            let obj;
            if (doesChatRoomExsists(pathname)) {
                obj = addConnectionToExsistingRoom(pathname);
                console.log("added new user to  room: " + pathname)
                let wssObj = obj.getMasterConnection();
                obj.sendMsgToAllUsers("new user has joined the chat");
                wssObj.handleUpgrade(request, socket, head, (ws) => {
                    wssObj.emit('connection', ws, request);
                });
            }else{
                socket.destroy();
            }
           
        }
    } catch (err) {
        console.log("error in req upgrade", err);
    }
});



