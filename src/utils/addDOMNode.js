var arrayForEach = require("@nathanfaucett/array-for_each"),
    getNodeId = require("./getNodeId");


module.exports = addDOMNode;


function addDOMNode(node) {
    var id = getNodeId(node);

    if (id) {
        arrayForEach(node.childNodes, addDOMNode);
    }
}