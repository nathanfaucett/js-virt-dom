var environment = require("environment"),
    eventListener = require("event_listener"),
    virtDOM = require("../../../src/index");


eventListener.on(environment.window, "load", function() {
    virtDOM.createWorkerRender("worker.js", document.getElementById("app"));
});
