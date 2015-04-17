var virtDOM = require("../../../src/index");


virtDOM.createWorkerRender("worker.js", document.getElementById("app"));
