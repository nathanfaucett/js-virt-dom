var virt = require("virt"),
    WorkerAdaptor = require("./worker_adaptor");


var root = null;


module.exports = render;


function render(nextView) {
    if (root === null) {
        root = new virt.Root();
        root.adaptor = new WorkerAdaptor(root);
    }

    root.render(nextView);
}

render.unmount = function() {
    if (root !== null) {
        root.unmount();
        root = null;
    }
};
