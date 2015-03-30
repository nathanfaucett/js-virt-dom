var virt = require("virt"),
    Adaptor = require("./adaptor"),
    renderString = require("./utils/render_string"),
    getRootNodeInContainer = require("./utils/get_root_node_in_container"),
    getNodeId = require("./utils/get_node_id"),
    getNodeById = require("./utils/get_node_by_id");


var rootsById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root;

    if (id === null) {
        root = new virt.Root();
        root.adaptor = new Adaptor(root, containerDOMNode);
        id = root.id;
        rootsById[id] = root;
    } else {
        root = rootsById[id];
    }

    root.render(nextView, id);
}

render.renderString = function(view, id) {
    return renderString(view, id || ".0");
};

render.unmount = function(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root = rootsById[id];

    if (root !== undefined) {
        root.render(undefined, id);
        delete rootsById[id];
    }
};

render.findDOMNode = function(component) {
    return (component && component.__node) ? getNodeById(component.__node.id) : null;
};
