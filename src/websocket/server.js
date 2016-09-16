var renderString = require("../utils/renderString"),
    nativeDOMComponents = require("../nativeDOM/components"),
    render = require("./renderWebSocket");


var virtDOMWebSocketServer = exports;


virtDOMWebSocketServer.virt = require("@nathanfaucett/virt");

virtDOMWebSocketServer.addNativeComponent = function(type, constructor) {
    nativeDOMComponents[type] = constructor;
};

virtDOMWebSocketServer.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOMWebSocketServer.findRoot = require("../utils/findRoot");
virtDOMWebSocketServer.findEventHandler = require("../utils/findEventHandler");

virtDOMWebSocketServer.render = render;
virtDOMWebSocketServer.unmount = render.unmount;