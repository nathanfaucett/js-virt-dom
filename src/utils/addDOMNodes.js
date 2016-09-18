var arrayForEach = require("@nathanfaucett/array-for_each"),
    addDOMNode = require("./addDOMNode"),
    isDOMChildrenSupported = require("./isDOMChildrenSupported");


if (isDOMChildrenSupported) {
    module.exports = function addDOMNodes(node) {
        arrayForEach(node.children, addDOMNode);
    };
} else {
    module.exports = function addDOMNodes(node) {
        arrayForEach(node.childNodes, addDOMNode);
    };
}