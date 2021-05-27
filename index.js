
const express = require('express')
const session = require('express-session');
const http = require('http')
const WebSocket = require('ws')
const chat_room = require('./chat_room');
const url = require('url');
const uuid = require('uuid');
const log4js = require("log4js");
const logger = log4js.getLogger("index");
logger.level = "debug"; 
const port = process.env.PORT || 8080
const app = express()
let server = require('http').createServer(app);
app.use(express.static(__dirname + '/public'));
app.use(express.json());
server.listen(port);
//let avialbleChatrooms = {};
const sessionParser = session({
    saveUninitialized: false,
    resave: false
  });
 // app.use(sessionParser);  
 let  avialbleChatrooms= new Map()
app.get('/', (req, res) => {
    
    res.sendFile(__dirname + '/public/html/homepage.html');
})


app.get('/greet', (req, res) => {
   
    res.send("Hello World! Iam alive");
})


app.get('/broadcast', (req, res) => {
   
    res.sendFile(__dirname + '/public/html/broadcast.html');
})


app.get('/viewscreen', (req, res) => {
   
    res.sendFile(__dirname + '/public/html/viewscreen.html');
})



app.get(/pavan/, function (req, res) {
    logger.debug(req.originalUrl);
    res.sendFile(__dirname + '/public/html/screen.html');
  })
app.get('/session',(req,res)=>{
    const id = uuid.v4();
    logger.debug(`Updating session for user ${id}`);
    req.session.userId = id;
    res.send({ result: 'OK', message: 'Session updated' });
})

app.post('/createSession', function (req, res) {
    let data = req.body;
    if(data.key!=="pavan"){
        res.sendStatus(401);
        return;
    }
    createAPrivateChatRoom(data.session_name);
    res.sendStatus(201);
})

const createAPrivateChatRoom = (roomName) => {
    //ceate and return a new chat room;
    //let r = Math.random().toString(36).substring(7);
    // logger.debug("random", r);
    // let newChatRoomName =  addRoomToGivenName(roomName);
    let chatRoomObj = new chat_room(roomName);
    avialbleChatrooms.set(roomName, chatRoomObj);
    logger.debug("created a chat room "+roomName)
    return chatRoomObj;
}
const doesChatRoomExsists = roomName => {
    return (avialbleChatrooms.get(roomName)!==undefined)
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
        return avialbleChatrooms.get(roomName);
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
            //logger.debug("destorying the socket")
            socket.destroy();
        }
        else {
            let obj;
            if (doesChatRoomExsists(pathname)) {
                obj = addConnectionToExsistingRoom(pathname);
                //logger.debug("Available Users are "+obj.availableUsers.length);
                //logger.debug("added new user to  room: " + pathname)
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
        logger.error(`error in req upgrade ${err}`);
    }
});



