var virt = require("virt"),
    Adapter = require("./Adapter"),
    rootsById = require("./rootsById"),
    getRootNodeInContainer = require("./utils/getRootNodeInContainer"),
    getNodeId = require("./utils/getNodeId");


var Root = virt.Root;


module.exports = render;


function render(nextView, containerDOMNode, callback) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root;

    if (id === null || rootsById[id] === undefined) {
        root = new Root();
        root.adapter = new Adapter(root, containerDOMNode);
        id = root.id;
        rootsById[id] = root;
    } else {
        root = rootsById[id];
    }

    root.render(nextView, id, callback);

    return root;
}
