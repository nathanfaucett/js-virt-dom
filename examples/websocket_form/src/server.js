var virt = require("@nathanfaucett/virt"),
    virtDOM = require("../../../src/index"),
    socket_io = require("socket.io"),
    App = require("./app");


var io = socket_io();


io.on("connection", function(socket) {
    virtDOM.renderWebSocket(
        virt.createView(App),
        socket,
        function attachMessage(socket, callback) {
            socket.on("client-message", callback);
        },
        function sendMessage(socket, data) {
            socket.emit("server-message", data);
        }
    );
});


io.listen(9999);
