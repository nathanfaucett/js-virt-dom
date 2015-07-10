var renderString = require("./utils/renderString"),
    nativeDOM = require("./nativeDOM");


var virtDOM = exports,
    nativeDOMComponents = nativeDOM.components,
    nativeDOMHandlers = nativeDOM.handlers;


virtDOM.virt = require("virt");

virtDOM.addNativeComponent = function(type, constructor) {
    nativeDOMComponents[type] = constructor;
};
virtDOM.addNativeHandler = function(name, fn) {
    nativeDOMHandlers[name] = fn;
};

virtDOM.render = require("./render");
virtDOM.unmount = require("./unmount");

virtDOM.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOM.findDOMNode = require("./utils/findDOMNode");

virtDOM.createWorkerRender = require("./worker/createWorkerRender");
virtDOM.renderWorker = require("./worker/renderWorker");

virtDOM.createWebSocketRender = require("./websocket/createWebSocketRender");
virtDOM.renderWebSocket = require("./websocket/renderWebSocket");
