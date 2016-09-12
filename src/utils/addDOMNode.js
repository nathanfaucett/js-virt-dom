var isElement = require("@nathanfaucett/is_element"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    getNodeId = require("./getNodeId");


module.exports = addDOMNode;


function addDOMNode(node) {
    if (isElement(node)) {
        getNodeId(node);
        arrayForEach(node.childNodes, addDOMNode);
    }
}