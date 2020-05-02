const displayImage = function (imageData) {

    try {
       
        drawImageBasedOnData("data:image/jpg;base64," +imageData);
       
    } catch (ex) {
        console.log("error in drawing data",ex)
    }
}

var drawImageBasedOnData = function (base64ImageData) {
    getNewImageElement(base64ImageData,).then(function (value) {
        var obj = {
        base64ImageData: base64ImageData
        
    };
        drawImageFromString(value);
    }).catch(function (err) {
        isCanvasBusy = false;
        console.log("error in resolving image " + err);
    });
}
var drawImageFromString = function (obj) {

    var canvasNJB = document.getElementById("canvas");
    var ctx = canvasNJB.getContext("2d");
    try {
        
        var height = 637;
        var width = 1019;
        var xBound = 0;
        var yBound = 0;
        canvasNJB.height = height;
        canvasNJB.width = width;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ///* pavan   
        ctx.drawImage(obj.imageElement, xBound, yBound, width, height);
    } catch (err) {
        logger.log("error in drawing image: " + err.message);
    }
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
function getNewImageElement(imageSrc, deviceID) {
    var obj = {
        imageElement:new Image()
       
    };
    return new Promise(function (resolve, reject) {
        

        obj.imageElement.onload = function () {
            resolve(obj);
            disposeImage(obj.imageElement);
        };

        obj.imageElement.src = imageSrc;

    });
}
function disposeImage(imageElement) {

    try {
        imageElement.remove();
    } catch (error) {
      //  console.log("error in removing" + error.message);
    } finally {
        imageElement = null;
    }
}

const decodeMessage =  buffer  =>{
        
    var _String = "";
    var arr = new Uint8Array(buffer);
    var a = String.fromCharCode(arr[2]);
    var a10 = String.fromCharCode(arr[1]);
    var a100 = String.fromCharCode(arr[0]);
    var stringLength = parseInt(a100 + a10 + a);
    for (var i = 3; i < stringLength + 3; i++)
        _String = _String + String.fromCharCode(arr[i]);
    
    base = getImageFromBinaryData(arr,stringLength);

    return {
        //binary: sliceArr,
        image: base,
        json: _String
    };
}
function getImageFromBinaryData(arr,stringLength){
//     var offset = 3; // Ignore first 3 bytes of data as they represent the length of json data in the byte array
//    var nb = arr.length - offset;
//    offset = 3 + stringLength;
//    if (nb < 4) {
//        return null;
//    }
    let offset = 0;
   var b0 = arr[offset];
   var b1 = arr[offset + 1];
   var b2 = arr[offset + 2];
   var b3 = arr[offset + 3];

   if (b0 === 0x89 && b1 === 0x50 && b2 === 0x4E && b3 === 0x47) {
       mime = 'image/png';
   } else if (b0 === 0xff && b1 === 0xd8) {
       mime = 'image/jpeg';
   } else if (b0 === 0x47 && b1 === 0x49 && b2 === 0x46) {
       mime = 'image/gif';
   } else {
       logger.logerror("failed to identify the mime type, image is broken");
       image = null;
       return null;
   }

   var binary = "";

   for (var i = 0; i < nb; i++) {
       binary += String.fromCharCode(arr[offset + i]);
   }

   var base = window.btoa(binary);

  // var sliceArr = arr.slice(offset);
   return base;
}

/*
MIT License

Copyright (c) 2020 Pavan Kumar Tulasi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var _host;
var _webSocket
function init() {
    var param = window.location.href;
    var primaryHost = window.location.hostname;
    console.log(" " + param + " " + primaryHost);

    openConnection();
    initializeHandlers();
    var button = document.getElementById("sendButton");
    button.onclick = sendMessageToServer;
    document.getElementById("textArea").value = ""
}
this.openConnection = function () {
    var protocolRequest = "ws";
    if ((location.protocol) === "https:") {
        protocolRequest = "wss"
    }
    //protocolRequest+"://"+window.location.hostname+":"+location.port+"/ChatApplication/demo"
    //protocolRequest+"://"+window.location.hostname+":"+location.port
    let endPoint = protocolRequest + "://" + window.location.host + window.location.pathname
    _webSocket = new WebSocket(endPoint);
}
this.initializeHandlers = function () {
    _webSocket.onopen = onOpen;
    _webSocket.onmessage = gotMessage;
    _webSocket.onclose = onClose;
}
let onOpen = function (msg) {
    console.log("new Connection");
    displayInTextBox("displayArea", "Welcome to Chat Arena , <br>Let's the fun Begin <br>!(^_^)!")
}
var gotMessage = function (msg) {
    let receivedData = JSON.parse(msg.data);
    let recievedMessage = receivedData.message;
    let recievedImage = receivedData.image;

    if (recievedMessage !== undefined) {
        // displayInTextBox("displayArea", recievedMessage.replace(/\n/g, '<br>'));
        displayMessageInDivChatBox(recievedMessage.replace(/\n/g, '<br>'));
    }if(recievedImage!==undefined){
        displayImage(recievedImage)
    }
}
let increment = 0;
const displayMessageInDivChatBox = (msgToDisplay) => {
    const time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
    var newDiv = document.createElement("div");
    let parah = document.createElement("p");
    let timeTag = document.createElement("p");
    let img = document.createElement("img");
    img.src = "../images/icon.png";
    timeTag.innerHTML = time;
    parah.innerHTML = msgToDisplay;
    increment = (++increment) % 2;
    if (increment === 0) {
        //parah.className="right";
        timeTag.className = "time-right";
        img.className = "left";
        newDiv.className = "container";
    } else {
        //parah.className="left";
        timeTag.className = "time-left";
        img.className = "right";
        newDiv.className = "container darker";
    }


    addElementAschild(newDiv, parah);
    addElementAschild(newDiv, timeTag);
    addElementAschild(newDiv, img);
    addElementAschild(getElementByItsID("displayArea"), newDiv)
}
const addElementAschild = (src, des) => {
    src.appendChild(des);
}
const getElementByItsID = (tagName) => document.getElementById(tagName);
let displayInTextBox = (tagName, message) => {
    let tag = document.getElementById(tagName);
    let br = document.createElement("br");
    tag.appendChild(br);
    tag.innerHTML = tag.innerHTML + message;
}
var onClose = function (msg) {
    //TODO Have to reconnect to the websocket if it's a timeout
    console.log("Closed connection");
    displayInTextBox("displayArea", "You have been disconnected :(")
}
function waitForSocketConnection(socket, callback) {
    var retryTimes = 0;
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                if (callback != null) {
                    callback();
                }
                return;

            } else {
                waitForSocketConnection(socket, callback);
            }
            if (retryTimes > 500) {
                return;
            }
            retryTimes++;

        }, 10); // wait 5 milisecond for the connection...
}
function sendMessageToServer() {
    var text = document.getElementById("textArea").value;
    var jsonMessage = {
        message: text,
    };
    document.getElementById("textArea").value = "";
    jsonMessage = JSON.stringify(jsonMessage);
    waitForSocketConnection(_webSocket, function () {
        _webSocket.send(jsonMessage);
    });
}