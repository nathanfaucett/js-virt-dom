var findDOMNode = require("../utils/findDOMNode"),
    blurNode = require("blur_node"),
    focusNode = require("focus_node");


var inputHandlers = exports;


inputHandlers.getValue = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        next(undefined, node.value);
    } else {
        next(new Error("getValue(callback): No DOM node found with id " + data.id));
    }
};

inputHandlers.setValue = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        node.value = data.value;
        next();
    } else {
        next(new Error("setValue(value, callback): No DOM node found with id " + data.id));
    }
};

inputHandlers.focus = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        focusNode(node);
        next();
    } else {
        next(new Error("focus(callback): No DOM node found with id " + data.id));
    }
};

inputHandlers.blur = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        blurNode(node);
        next();
    } else {
        next(new Error("blur(callback): No DOM node found with id " + data.id));
    }
};
