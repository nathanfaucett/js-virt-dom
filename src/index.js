var virt = require("../virt"),
    Adaptor = require("./adaptor"),
    getRootNodeInContainer = require("./utils/get_root_node_in_container"),
    getNodeId = require("./utils/get_node_id");


var rootNodesById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode, rootNode, id;

    rootDOMNode = getRootNodeInContainer(containerDOMNode);
    id = getNodeId(rootDOMNode);

    if (id === null) {
        rootNode = new virt.Root();
        rootNode.renderer.adaptor = new Adaptor(containerDOMNode, rootNode);
        id = rootNode.id;
        rootNodesById[id] = rootNode;
    } else {
        rootNode = rootNodesById[id];
    }

    virt.render(nextView, rootNode, id);
}

