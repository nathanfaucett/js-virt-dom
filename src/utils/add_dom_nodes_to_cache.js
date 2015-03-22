var isElement = require("is_element"),
    getNodeId = require("./get_node_id");


module.exports = addDOMNodesToCache;


function addDOMNodesToCache(nodes) {
    var i = -1,
        il = nodes.length - 1,
        node;

    while (i++ < il) {
        node = nodes[i];

        if (isElement(node)) {
            getNodeId(node);
            addDOMNodesToCache(node.childNodes);
        }
    }
}
