var render = require("./render"),
    renderString = require("./utils/renderString"),
    nativeDOM = require("./nativeDOM");


var virtDOM = exports;


virtDOM.virt = require("virt");

virtDOM.nativeComponents = nativeDOM.components;
virtDOM.nativeHandlers = nativeDOM.handlers;

virtDOM.render = render;
virtDOM.unmount = render.unmount;

virtDOM.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOM.findDOMNode = require("./utils/findDOMNode");

virtDOM.createWorkerRender = require("./worker/createWorkerRender");
virtDOM.renderWorker = require("./worker/renderWorker");

virtDOM.createWebSocketRender = require("./websocket/createWebSocketRender");
virtDOM.renderWebSocket = require("./websocket/renderWebSocket");
