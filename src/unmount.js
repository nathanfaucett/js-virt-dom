var rootsById = require("./rootsById"),
    getRootNodeInContainer = require("./utils/getRootNodeInContainer"),
    getNodeId = require("./utils/getNodeId");


module.exports = unmount;


function unmount(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root = rootsById[id];

    if (root !== undefined) {
        root.unmount();
        delete rootsById[id];
    }
}