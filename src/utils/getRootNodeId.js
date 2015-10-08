var getRootNodeInContainer = require("./getRootNodeInContainer"),
    getNodeId = require("./getNodeId");


module.exports = getRootNodeId;


function getRootNodeId(containerDOMNode) {
    return getNodeId(getRootNodeInContainer(containerDOMNode));
}
