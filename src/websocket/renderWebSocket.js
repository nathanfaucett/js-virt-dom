var virt = require("@nathanfaucett/virt"),
    isNull = require("@nathanfaucett/is_null"),
    rootsById = require("../rootsById"),
    WebSocketAdapter = require("./WebSocketAdapter");


var root = null;


module.exports = render;


function render(nextView, socket, attachMessage, sendMessage, callback) {
    if (isNull(root)) {
        root = new virt.Root();
        root.adapter = new WebSocketAdapter(root, socket, attachMessage, sendMessage);
        rootsById[root.id] = root;
    }
    root.render(nextView, callback);
    return root;
}

render.unmount = function(root) {
    if (!isNull(root)) {
        delete rootsById[root.id];
        root.unmount();
        root = null;
    }
};