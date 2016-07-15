var virt = require("@nathanfaucett/virt"),
    virtDOM = require("../../../src/index"),
    App = require("./app");


virtDOM.renderWorker(virt.createView(App));
