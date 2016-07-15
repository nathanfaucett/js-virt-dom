var environment = require("@nathanfaucett/environment"),
    eventListener = require("@nathanfaucett/event_listener"),
    virt = require("@nathanfaucett/virt"),
    virtDOM = require("../../../src/index"),
    App = require("./app");


eventListener.on(environment.window, "load", function() {
    virtDOM.render(virt.createView(App), document.getElementById("app"));
});
