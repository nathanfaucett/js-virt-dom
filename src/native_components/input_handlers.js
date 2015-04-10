var findDOMNode = require("../utils/find_dom_node");


var inputHandlers = exports;


inputHandlers.getValue = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        next(undefined, node.value);
    } else {
        next(new Error("Input getValue(callback): No DOM node found with id " + data.id));
    }
};

inputHandlers.setValue = function(data, next) {
    var node = findDOMNode(data.id);

    if (node) {
        node.value = data.value;
        next(undefined);
    } else {
        next(new Error("Input setValue(value, callback): No DOM node found with id " + data.id));
    }
};
