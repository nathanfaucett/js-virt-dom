var virt = require("virt"),
    virtDOM = require("../../../src/index"),
    App = require("./app");


virtDOM.renderWorker(virt.createView(App));
