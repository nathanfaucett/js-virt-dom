var arrayForEach = require("@nathanfaucett/array-for_each"),
    isElement = require("@nathanfaucett/is_element"),
    getNodeId = require("./getNodeId"),
    isDOMChildrenSupported = require("./isDOMChildrenSupported");


if (isDOMChildrenSupported) {
    module.exports = function addDOMNode(node) {
        getNodeId(node);
        arrayForEach(node.children, addDOMNode);
    };
} else {
    module.exports = function addDOMNode(node) {
        if (isElement(node)) {
            getNodeId(node);
            arrayForEach(node.childNodes, addDOMNode);
        }
    };
}