var virt = require("virt"),
    Adaptor = require("./adaptor"),
    renderString = require("./utils/render_string"),
    getRootNodeInContainer = require("./utils/get_root_node_in_container"),
    getNodeId = require("./utils/get_node_id"),
    getNodeById = require("./utils/get_node_by_id");


var rootNodesById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        rootNode;

    if (id === null) {
        rootNode = new virt.Root(new Adaptor(containerDOMNode));
        id = rootNode.id;
        rootNodesById[id] = rootNode;
    } else {
        rootNode = rootNodesById[id];
    }

    rootNode.render(nextView, id);
}

render.unmount = function(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode);

    if (id !== null) {
        delete rootNodesById[id];
    }
};

render.string = function(view, id) {
    return renderString(view, id || ".0");
};

render.findDOMNode = function(component) {
    return (component && component.__node) ? getNodeById(component.__node.id) : null;
};
