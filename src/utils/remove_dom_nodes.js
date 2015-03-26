var isElement = require("is_element"),
    nodeCache = require("./node_cache"),
    getNodeAttributeId = require("./get_node_attribute_id");


module.exports = removeDOMNodes;


function removeDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        removeDOMNode(nodes[i]);
    }
}

function removeDOMNode(node) {
    if (isElement(node)) {
        delete nodeCache[getNodeAttributeId(node)];
        removeDOMNodes(node.childNodes);
    }
}
