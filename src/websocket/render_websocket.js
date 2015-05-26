var virt = require("virt"),
    WebSocketAdaptor = require("./websocket_adaptor");


module.exports = render;


function render(nextView, socket, attachMessage, sendMessage) {
    var root = new virt.Root();
    root.adaptor = new WebSocketAdaptor(root, socket, attachMessage, sendMessage);
    root.render(nextView);
    return root;
}
