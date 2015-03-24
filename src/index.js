var virt = require("virt"),
    Adaptor = require("./adaptor"),
    getRootNodeInContainer = require("./utils/get_root_node_in_container"),
    getNodeId = require("./utils/get_node_id"),
    getNodeById = require("./utils/get_node_by_id");


var rootNodesById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode, rootNode, id;

    rootDOMNode = getRootNodeInContainer(containerDOMNode);
    id = getNodeId(rootDOMNode);

    if (id === null) {
        rootNode = new virt.Root();
        rootNode.adaptor = new Adaptor(containerDOMNode, rootNode);
        id = rootNode.id;
        rootNodesById[id] = rootNode;
    } else {
        rootNode = rootNodesById[id];
    }

    rootNode.render(nextView, id);
}

render.findDOMNode = function(component) {
    return (component && component.__node) ? getNodeById(component.__node.id) : null;
};
