var virt = require("virt"),
    WorkerAdapter = require("./WorkerAdapter");


var root = null;


module.exports = render;


function render(nextView, callback) {
    if (root === null) {
        root = new virt.Root();
        root.adapter = new WorkerAdapter(root);
    }

    root.render(nextView, callback);
}

render.unmount = function() {
    if (root !== null) {
        root.unmount();
        root = null;
    }
};
