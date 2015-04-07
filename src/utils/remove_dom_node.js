var isElement = require("is_element"),
    nodeCache = require("./node_cache"),
    getNodeAttributeId = require("./get_node_attribute_id");


module.exports = removeDOMNode;


var removeDOMNodes = require("./remove_dom_nodes");


function removeDOMNode(node) {
    if (isElement(node)) {
        delete nodeCache[getNodeAttributeId(node)];
        removeDOMNodes(node.childNodes);
    }
}
