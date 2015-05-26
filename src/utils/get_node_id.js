var has = require("has"),
    nodeCache = require("./node_cache"),
    getNodeAttributeId = require("./get_node_attribute_id");


module.exports = getNodeId;


function getNodeId(node) {
    return node && getId(node);
}

function getId(node) {
    var id = getNodeAttributeId(node),
        cached;

    if (id) {
        if (has(nodeCache, id)) {
            cached = nodeCache[id];

            if (cached !== node) {
                nodeCache[id] = node;
            }
        } else {
            nodeCache[id] = node;
        }
    }

    return id;
}
