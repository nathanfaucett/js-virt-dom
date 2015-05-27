var render = require("./render"),
    renderString = require("./utils/render_string");


require("./native_components");


var virtDOM = exports;


virtDOM.virt = require("virt");

virtDOM.render = render;
virtDOM.unmount = render.unmount;

virtDOM.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOM.findDOMNode = require("./utils/find_dom_node");

virtDOM.createWorkerRender = require("./worker/create_worker_render");
virtDOM.renderWorker = require("./worker/render_worker");

virtDOM.createWebSocketRender = require("./websocket/create_websocket_render");
virtDOM.renderWebSocket = require("./websocket/render_websocket");
