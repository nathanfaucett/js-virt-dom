var virt = require("virt"),
    WebSocketAdapter = require("./websocket_adapter");


module.exports = render;


function render(nextView, socket, attachMessage, sendMessage) {
    var root = new virt.Root();
    root.adapter = new WebSocketAdapter(root, socket, attachMessage, sendMessage);
    root.render(nextView);
    return root;
}
