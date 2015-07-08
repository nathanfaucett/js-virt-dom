var environment = require("environment"),
    eventListener = require("event_listener"),
    virtDOM = require("../../../src/index");


virtDOM.nativeHandlers["worker_form.App.getHeight"] = function(data, callback) {
    var node = virtDOM.findDOMNode(data.id);
    
    if (node) {
        callback(undefined, {
            height: node.offsetHeight
        });
    } else {
        callback(new Error("App:getHeight not DOM node with id "+ data.id));
    }
};


eventListener.on(environment.window, "load", function() {
    virtDOM.createWorkerRender("worker.js", document.getElementById("app"));
});


