var nodeCache = require("./nodeCache"),
    getNodeAttributeId = require("./getNodeAttributeId");


module.exports = getNodeId;


function getNodeId(node) {
    var id;

    if (node) {
        id = getNodeAttributeId(node);

        if (id) {
            nodeCache[id] = node;
        }
    }

    return id;
}