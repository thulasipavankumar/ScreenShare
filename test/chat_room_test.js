const chat_room = require('../chat_room');
let roomHello = new chat_room("Hello");
let roomHelloAgain = new chat_room("HelloAgain");
print = (toPrint) => console.log(toPrint);
print(roomHello.getChatRoomName());
print(roomHelloAgain.getChatRoomName());

roomHello.addUserToTheExsistingList("pavan")

//roomHello.addUserToTheExsistingList


print(roomHelloAgain.getAllUsers());
print(roomHello.getAllUsers());