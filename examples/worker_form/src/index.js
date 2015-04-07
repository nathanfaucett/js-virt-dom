var environment = require("environment"),
    eventListener = require("event_listener"),
    virtDOM = require("../../../src/index");


eventListener.on(environment.window, "load", function() {
    var messenger = virtDOM.createWorkerRender("worker.js", document.getElementById("app"));

    messenger.on("TodoForm:onSubmit", function(id, callback) {
        var node = virtDOM.findDOMNode(id);

        if (node) {
            callback(undefined, node.value);
            node.value = "";
        }
    });

    messenger.on("TodoForm:onInput", function(id, callback) {
        var node = virtDOM.findDOMNode(id);

        if (node) {
            callback(undefined, node.value);
        }
    });
});
