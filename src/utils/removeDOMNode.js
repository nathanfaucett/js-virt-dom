var arrayForEach = require("@nathanfaucett/array-for_each"),
    isElement = require("@nathanfaucett/is_element"),
    nodeCache = require("./nodeCache"),
    getNodeAttributeId = require("./getNodeAttributeId"),
    isDOMChildrenSupported = require("./isDOMChildrenSupported");


if (isDOMChildrenSupported) {
    module.exports = function removeDOMNode(node) {
        var id = getNodeAttributeId(node);
        delete nodeCache[id];
        arrayForEach(node.children, removeDOMNode);
    };
} else {
    module.exports = function addDOMNode(node) {
        if (isElement(node)) {
            delete nodeCache[getNodeAttributeId(node)];
            arrayForEach(node.childNodes, removeDOMNode);
        }
    };
}