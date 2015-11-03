var virt = require("virt"),
    isNull = require("is_null"),
    rootsById = require("../rootsById"),
    WorkerAdapter = require("./WorkerAdapter");


var root = null;


module.exports = render;


function render(nextView, callback) {
    if (isNull(root)) {
        root = new virt.Root();
        root.adapter = new WorkerAdapter(root);
        rootsById[root.id] = root;
    }

    root.render(nextView, callback);
}

render.unmount = function() {
    if (!isNull(root)) {
        delete rootsById[root.id];
        root.unmount();
        root = null;
    }
};
