var isElement = require("is_element"),
    getNodeId = require("./get_node_id");


module.exports = addDOMNode;


function addDOMNode(node) {
    if (isElement(node)) {
        getNodeId(node);
        addDOMNodes(node.childNodes);
    }
}

function addDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        addDOMNode(nodes[i]);
    }
}