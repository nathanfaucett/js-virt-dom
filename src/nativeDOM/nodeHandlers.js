var domDimensions = require("dom_dimensions"),
    findDOMNode = require("../utils/findDOMNode");


var nodeHandlers = exports;


nodeHandlers["virt.getViewTop"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.top(node));
    } else {
        callback(new Error("getViewTop: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewRight"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.right(node));
    } else {
        callback(new Error("getViewRight: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewBottom"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.bottom(node));
    } else {
        callback(new Error("getViewBottom: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewLeft"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.left(node));
    } else {
        callback(new Error("getViewLeft: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.getViewWidth"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.width(node));
    } else {
        callback(new Error("getViewWidth: No DOM node found with id " + data.id));
    }
};
nodeHandlers["virt.getViewHeight"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions.height(node));
    } else {
        callback(new Error("getViewHeight: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.getViewDimensions"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domDimensions(node));
    } else {
        callback(new Error("getViewDimensions: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.getViewProperty"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, node[data.property]);
    } else {
        callback(new Error("getViewDimensions: No DOM node found with id " + data.id));
    }
};

nodeHandlers["virt.setViewProperty"] = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        node[data.property] = data.value;
        callback(undefined);
    } else {
        callback(new Error("getViewDimensions: No DOM node found with id " + data.id));
    }
};
