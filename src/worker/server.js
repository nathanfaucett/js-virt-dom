var renderString = require("../utils/renderString"),
    nativeDOMComponents = require("../nativeDOM/components"),
    render = require("./renderWorker");


var virtDOMWorkerServer = exports;


virtDOMWorkerServer.virt = require("@nathanfaucett/virt");

virtDOMWorkerServer.addNativeComponent = function(type, constructor) {
    nativeDOMComponents[type] = constructor;
};

virtDOMWorkerServer.renderString = function(view, id) {
    return renderString(view, null, id || ".0");
};

virtDOMWorkerServer.findRoot = require("../utils/findRoot");
virtDOMWorkerServer.findEventHandler = require("../utils/findEventHandler");

virtDOMWorkerServer.render = render;
virtDOMWorkerServer.unmount = render.unmount;