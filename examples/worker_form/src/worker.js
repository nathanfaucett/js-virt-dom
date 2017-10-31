var virtDOM = require("../../../src/worker/server"),
    virt = require("@nathanfaucett/virt"),
    App = require("./app");


virtDOM.render(virt.createView(App));
