var renderString = require("./utils/renderString"),
    nativeDOMComponents = require("./nativeDOM/components"),
    nativeDOMHandlers = require("./nativeDOM/handlers");


var virtDOM = exports;


virtDOM.virt = require("@nathanfaucett/virt");

virtDOM.addNativeComponent = function(type, constructorFn) {
    nativeDOMComponents[type] = constructorFn;
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
virtDOM.findRoot = require("./utils/findRoot");
virtDOM.findEventHandler = require("./utils/findEventHandler");