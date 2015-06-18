var virt = require("virt"),
    WorkerAdapter = require("./worker_adapter");


var root = null;


module.exports = render;


function render(nextView) {
    if (root === null) {
        root = new virt.Root();
        root.adapter = new WorkerAdapter(root);
    }

    root.render(nextView);
}

render.unmount = function() {
    if (root !== null) {
        root.unmount();
        root = null;
    }
};
