var render = require("./render"),
    renderString = require("./utils/render_string");


var virtDOM = exports;


module.exports = virtDOM;

virtDOM.render = render;
virtDOM.unmount = render.unmount;

virtDOM.renderString = function(view, id) {
    return renderString(view, id || ".0");
};

virtDOM.findDOMNode = require("./utils/find_dom_node");

virtDOM.createWorkerRender = require("./worker/create_worker_render");
virtDOM.renderWorker = require("./worker/render_worker");
