var arrayForEach = require("@nathanfaucett/array-for_each"),
    isDOMChildrenSupported = require("./isDOMChildrenSupported"),
    removeDOMNode = require("./removeDOMNode");


if (isDOMChildrenSupported) {
    module.exports = function removeDOMNode(node) {
        arrayForEach(node.children, removeDOMNode);
    };
} else {
    module.exports = function addDOMNode(node) {
        arrayForEach(node.childNodes, removeDOMNode);
    };
}