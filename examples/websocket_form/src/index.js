var environment = require("@nathanfaucett/environment"),
    eventListener = require("@nathanfaucett/event_listener"),
    io = require("socket.io-client"),
    virtDOM = require("../../../src/websocket/client");


eventListener.on(environment.window, "load", function() {
    var socket = io("localhost:9999"),
        id;

    socket.on("connect", function onConnect() {
        if (id && socket.id !== id) {
            location.reload();
        } else {
            id = socket.id;
        }

        virtDOM.createRenderer(
            document.getElementById("app"),
            socket,
            function attachMessage(socket, callback) {
                socket.on("server-message", callback);
            },
            function sendMessage(socket, data) {
                socket.emit("client-message", data);
            }
        );
    });

    socket.on("error", function(error) {
        console.log(error);
    });
});
