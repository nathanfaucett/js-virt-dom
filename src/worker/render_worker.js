var virt = require("virt"),
    WorkerAdaptor = require("./worker_adaptor");


var ComponentPrototype = virt.Component.prototype,
    root = null;


module.exports = render;


function render(nextView) {
    if (root === null) {
        root = new virt.Root();
        root.adaptor = new WorkerAdaptor(root);

        ComponentPrototype.emitMessage = emitMessage;
        ComponentPrototype.onMessage = onMessage;
        ComponentPrototype.offMessage = offMessage;
    }

    root.render(nextView);
}

render.unmount = function() {
    if (root !== null) {
        root.unmount();
        root = null;
    }
};


function emitMessage(name, data, callback) {
    return this.__node.root.adaptor.messenger.emit(name, data, callback);
}

function onMessage(name, callback) {
    return this.__node.root.adaptor.messenger.on(name, callback);
}

function offMessage(name, callback) {
    return this.__node.root.adaptor.messenger.off(name, callback);
}
