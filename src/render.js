var virt = require("virt"),
    Adapter = require("./Adapter"),
    rootsById = require("./rootsById"),
    getRootNodeId = require("./utils/getRootNodeId");


var Root = virt.Root;


module.exports = render;


function render(nextView, containerDOMNode, callback) {
    var id = getRootNodeId(containerDOMNode),
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
