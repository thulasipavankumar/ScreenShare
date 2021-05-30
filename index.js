
const express = require('express')
const session = require('express-session');
const {
	Validator,
	ValidationError,
} = require("express-json-validator-middleware");
const conf = require("./conf").prod;
const { validate } = new Validator();
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
 let  avialbleChatrooms = new Map();
 let  session_to_key_map = new Map();
const constructUrl = (arg) => {
    return conf.server+arg;
}
 const  validationErrorMiddleware = (error, request, response, next) => {
	if (response.headersSent) {
		return next(error);
	}

	const isValidationError = error instanceof ValidationError;
	if (!isValidationError) {
		return next(error);
	}

	response.status(400).json({
		errors: error.validationErrors,
	});

	next();
}
app.use(validationErrorMiddleware);
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
/*
Consumes:  {
    key: required <string>
    session_name: required <string>
}
Produces: {
    session_name: 
    key: secret
    url: url for the user to connect to access the screen <string>
}
*/
const sessionSchema = {
	type: "object",
	required: ["session_name", "key"],
	properties: {
		session_name: {
			type: "string",
			minLength: 6,
		},
		key: {
			type: "string",
			minLength: 6,
		}
	},
};
app.post('/createSession', validate({ body: sessionSchema }), (req, res,next) =>{
    let data = req.body;
    // if(data.key!=="pavan"){
    //     res.sendStatus(401);
    //     return;
    // }
    const session_name = data.session_name;
    const key = data.key;
    if(doesChatRoomExsists(session_name)){
        res.status(403).json({msg:"Session name  is already taken please choose an other one"});
        return;
    }
    createAPrivateChatRoom(session_name);
    session_to_key_map.set(session_name, key);
    res.status(201).json({
        session_name,
        secret:key,
        url:constructUrl(session_name+"/"+key)
    })
    next();
})
const is_valid_key_for_session = (session,key) =>   {
    const value = session_to_key_map.get(session);
    return (key===value)

}



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
// write test cases
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
const authenticate = (path,key) => {
    //change for production push
    //request.headers.host.includes("localhost")
    return is_valid_key_for_session(path,key)
}

server.on('upgrade', function upgrade(request, socket, head) {
    try {
        const pathname = url.parse(request.url).pathname.substr(1);
        const [session_name,key] = pathname.split("/");
        if (!authenticate(session_name,key)) {
            //logger.debug("destorying the socket")
            socket.destroy();
        }
        else {
            let obj;
            if (doesChatRoomExsists(session_name)) {
                obj = addConnectionToExsistingRoom(session_name);
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
        socket.destroy();
    }
});



