var virt = require("@nathanfaucett/virt"),
    isString = require("@nathanfaucett/is_string"),

    DOM_ID_NAME = require("../DOM_ID_NAME"),
    nodeCache = require("./nodeCache"),

    applyProperties = require("../applyProperties");


var View = virt.View,
    isPrimitiveView = View.isPrimitiveView;


module.exports = createDOMElement;


function createDOMElement(view, id, document) {
    var node;

    if (isPrimitiveView(view)) {
        return document.createTextNode(view);
    } else if (isString(view.type)) {
        node = document.createElement(view.type);

        applyProperties(node, id, view.props, undefined);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        return node;
    } else {
        throw new TypeError("Arguments do not describe a valid view");
    }
}