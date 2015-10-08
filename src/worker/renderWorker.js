var virt = require("virt"),
    rootsById = require("../rootsById"),
    WorkerAdapter = require("./WorkerAdapter");


var root = null;


module.exports = render;


function render(nextView, callback) {
    if (root === null) {
        root = new virt.Root();
        root.adapter = new WorkerAdapter(root);
        rootsById[root.id] = root;
    }

    root.render(nextView, callback);
}

render.unmount = function() {
    if (root !== null) {
        delete rootsById[root.id];
        root.unmount();
        root = null;
    }
};
