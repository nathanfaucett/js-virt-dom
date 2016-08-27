var isElement = require("@nathanfaucett/is_element"),
    nodeCache = require("./nodeCache"),
    getNodeAttributeId = require("./getNodeAttributeId");


module.exports = removeDOMNode;


var removeDOMNodes = require("./removeDOMNodes");


function removeDOMNode(node) {
    if (isElement(node)) {
        delete nodeCache[getNodeAttributeId(node)];
        removeDOMNodes(node.childNodes);
    }
}