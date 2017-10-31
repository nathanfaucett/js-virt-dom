var virtDOM = require("../../../src/websocket/server"),
    virt = require("@nathanfaucett/virt"),
    socket_io = require("socket.io"),
    App = require("./app");


var io = socket_io(),
    root = null;


io.on("connection", function(socket) {
    virtDOM.render(
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


console.log("listening on port 9999");
io.listen(9999);
