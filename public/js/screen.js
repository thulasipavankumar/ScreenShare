var displayImage = function (imageData) {

    try {
        var decodedMessage = decodeMessage(msg.data); //made changes
        var jsonValue = decodedMessage.json;
        var jsonCoreContent = JSON.parse(jsonValue).value;
        var jsonData = JSON.parse(jsonValue);
        if ((jsonCoreContent).indexOf("image") > -1) {
            initializeCommandSocket();
            var base64ImageData = "data:image/jpg;base64," + decodedMessage.image;
            var deviceID = Listener.currentID;
            drawImageBasedOnData(base64ImageData, deviceID);
            if (!gotImage) {
                gotImage = true;
                resetScreenLoaderIcon();
            }
        } 
    } catch (ex) {
        isCanvasBusy = false;
        logger.logerror(ex.message);
    }
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

    if (recievedMessage !== undefined) {
        // displayInTextBox("displayArea", recievedMessage.replace(/\n/g, '<br>'));
        displayMessageInDivChatBox(recievedMessage.replace(/\n/g, '<br>'));
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