
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const chat_room = require('./chat_room');
const url = require('url');

const port = process.env.PORT || 8080
const app = express()
var server = require('http').createServer(app);
app.use(express.static(__dirname + '/public'));
server.listen(port);
let avialbleChatrooms = {};
// app.get('/',  (req, res) =>{
//     console.log(req.originalUrl);
//     res.sendFile(__dirname + '/public/html/index.html');
//  })
app.get('/', (req, res) => {
   
    res.sendFile(__dirname + '/public/html/screen.html');
})
app.get(/room/, function (req, res) {
    console.log(req.originalUrl);
    res.sendFile(__dirname + '/public/html/index.html');
})
const getRandomText = (digits) => {
    digits = digits ? digits : 7;
    let r = Math.random().toString(36).substring(digits);
    return r;
}
const createAPrivateChatRoom = (roomName) => {
    //ceate and return a new chat room;
    //let r = Math.random().toString(36).substring(7);
    // console.log("random", r);
    // let newChatRoomName =  addRoomToGivenName(roomName);
    let chatRoomObj = new chat_room(roomName);
    avialbleChatrooms[roomName] = chatRoomObj
    return chatRoomObj;
}
const doesChatRoomExsists = roomName => avialbleChatrooms.hasOwnProperty(roomName);
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
///////////////////////////////////
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

wss1.on('connection',  ws => {

        ws.on('error', ()=>{

        });
        ws.on('close', (code, data) => {
            console.log("closing code:" + code, data)
        });
        ws.on('message', (data) => {
            const screenshot = require('screenshot-desktop');
            screenshot({ format: 'jpg' }).then((img) => {
                // img: Buffer filled with jpg goodness
                // ...
                let buff = new Buffer(img);
                let base64data = buff.toString('base64');
                let jsonMsg = {};
                jsonMsg.message = data;
                jsonMsg.origin = ws.origin;
                jsonMsg.image = base64data;
                ws.send(JSON.stringify(jsonMsg));
            }).catch((err) => {
                console.log("error in promise",err)
                // ...
            })

        });

});

/////////////////////////////////

server.on('upgrade', function upgrade(request, socket, head) {
    try {
        ///////////////////////////////////////
        wss1.handleUpgrade(request, socket, head, function done(ws) {
            wss1.emit('connection', ws, request);
        });



        /////////////////////////////////////
        console.log("Got an upgrade request")
        return;
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
            } else {
                obj = createAPrivateChatRoom(pathname);
                console.log("created  new  room: " + pathname)
            }
            let wssObj = obj.getMasterConnection();
            obj.sendMsgToAllUsers("new user has joined the chat");
            wssObj.handleUpgrade(request, socket, head, (ws) => {
                wssObj.emit('connection', ws, request);
            });
        }
    } catch (err) {
        console.log("error in req upgrade", err);
    }
});



