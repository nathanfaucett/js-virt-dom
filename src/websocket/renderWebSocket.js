var virt = require("virt"),
    WebSocketAdapter = require("./WebSocketAdapter");


module.exports = render;


function render(nextView, socket, attachMessage, sendMessage, callback) {
    var root = new virt.Root();
    root.adapter = new WebSocketAdapter(root, socket, attachMessage, sendMessage);
    root.render(nextView, callback);
    return root;
}
