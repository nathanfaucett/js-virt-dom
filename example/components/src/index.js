var environment = require("environment"),
    eventListener = require("event_listener"),
    virt = require("../../../src/index"),
    virtDOM = require("../../../src/virt_dom"),
    App = require("./app");


var app = document.getElementById("app");


eventListener.on(environment.window, "load", function() {
    virtDOM(virt.createView(App), app);
});
