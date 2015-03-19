var has = require("has"),
    nodeCache = require("./node_cache"),
    DOM_ID_NAME = require("../dom_id_name");


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

function getNodeAttributeId(node) {
    return node && node.getAttribute && node.getAttribute(DOM_ID_NAME) || "";
}
