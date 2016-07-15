var environment = require("@nathanfaucett/environment"),
    eventListener = require("@nathanfaucett/event_listener"),
    virtDOM = require("../../../src/index");


virtDOM.addNativeHandler("worker_form.App.getHeight", function(data, callback) {
    var node = virtDOM.findDOMNode(data.id);
    
    if (node) {
        callback(undefined, {
            height: node.offsetHeight
        });
    } else {
        callback(new Error("App:getHeight not DOM node with id "+ data.id));
    }
});


eventListener.on(environment.window, "load", function() {
    virtDOM.createWorkerRender("worker.js", document.getElementById("app"));
});


