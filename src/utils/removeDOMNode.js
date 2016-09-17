var isElement = require("@nathanfaucett/is_element"),
    arrayForEach = require("@nathanfaucett/array-for_each"),
    nodeCache = require("./nodeCache"),
    getNodeAttributeId = require("./getNodeAttributeId");


module.exports = removeDOMNode;


function removeDOMNode(node) {
    var id = getNodeAttributeId(node);

    if (id) {
        delete nodeCache[id];
        arrayForEach(node.childNodes, removeDOMNode);
    }
}