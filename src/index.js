var render = require("./render"),
    renderString = require("./utils/render_string"),
    getNodeById = require("./utils/get_node_by_id");


var virtDOM = exports;


module.exports = virtDOM;

virtDOM.render = render;
virtDOM.unmount = render.unmount;

virtDOM.renderString = function(view, id) {
    return renderString(view, id || ".0");
};

virtDOM.findDOMNode = function(component) {
    return (component && component.__node) ? getNodeById(component.__node.id) : null;
};

virtDOM.CSSTransitionGroup = require("./transitions/css_transition_group");

virtDOM.createWorkerRender = require("./worker/create_worker_render");
virtDOM.renderWorker = require("./worker/render_worker");
