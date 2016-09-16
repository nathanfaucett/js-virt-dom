var renderString = require("../utils/renderString"),
    nativeDOMHandlers = require("../nativeDOM/handlers");


var virtDOMWorkerClient = exports;


virtDOMWorkerClient.virt = require("@nathanfaucett/virt");

virtDOMWorkerClient.addNativeHandler = function(name, fn) {
    nativeDOMHandlers[name] = fn;
};

virtDOMWorkerClient.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOMWorkerClient.findDOMNode = require("../utils/findDOMNode");
virtDOMWorkerClient.createRenderer = require("./createWorkerRenderer");