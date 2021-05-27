const chat_room = require('../chat_room');



test('pass empty string and check for error',()=>{
   
    
    expect(()=>new chat_room(undefined)).toThrow("");
    expect(()=>new chat_room()).toThrow("");
    expect(()=>new chat_room("")).toThrow("");
  })


  test('',()=>{
    
     
     expect(1).toBe(1);
   })