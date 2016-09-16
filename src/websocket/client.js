var renderString = require("../utils/renderString"),
    nativeDOMHandlers = require("../nativeDOM/handlers");


var virtDOMWebSocketClient = exports;


virtDOMWebSocketClient.virt = require("@nathanfaucett/virt");

virtDOMWebSocketClient.addNativeHandler = function(name, fn) {
    nativeDOMHandlers[name] = fn;
};

virtDOMWebSocketClient.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOMWebSocketClient.findDOMNode = require("../utils/findDOMNode");
virtDOMWebSocketClient.createRenderer = require("./createWebSocketRenderer");