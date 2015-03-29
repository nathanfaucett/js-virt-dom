var environment = require("environment"),
    eventListener = require("event_listener"),
    virt = require("virt"),
    virtDOM = require("../../../src/index"),
    App = require("./app");


eventListener.on(environment.window, "load", function() {
    virtDOM(virt.createView(App), document.getElementById("app"));
});
