class websocket_template {
    constructor(wssobj){
        ws.on('open',  () => {
        
        });
        ws.on('error', () =>{
          
      });
      ws.on('close', () =>{
          //delete  user from chat room 
          console.log("user disconnected");
      });
      ws.on('message', function incoming(data) {
        // console.log(data);
    //      let jsonMsg={};
    //      jsonMsg.message=data;
    //      jsonMsg.origin = ws.origin;
    //      wss.clients.forEach(function each(client) {
    //          if (client.readyState === WebSocket.OPEN) {
    //            client.send(JSON.stringify(jsonMsg));
    //          }
    //        });
    //   
     });

    }
}