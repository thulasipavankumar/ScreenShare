class websocket_manager{
    usersLists={}
    constructor(name){
        this.name=name;
    }
   
        
    
    addConnectionToList =(connectionName,connection)=>{
        this.usersLists[connectionName]=connection;
    }
}
module.exports = websocket_manager;