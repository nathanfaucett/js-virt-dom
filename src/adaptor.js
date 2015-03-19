var renderString = require("./render_string"),
    getNodeById = require("./utils/get_node_by_id");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(containerDOMNode, rootNode) {
    this.containerDOMNode = containerDOMNode;
    this.rootNode = rootNode;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.mount = function(id, view, callback) {
    var nodeDOM = getNodeById(id) || this.containerDOMNode;

    nodeDOM.innerHTML = renderString(view, id);

    callback();
};

AdaptorPrototype.unmount = function(id, callback) {
    var nodeDOM = getNodeById(id);

    if (nodeDOM !== undefined) {
        nodeDOM.parent.removeChild(nodeDOM);
    } else {
        this.containerDOMNode.innerHTML = "";
    }

    callback();
};

AdaptorPrototype.update = function(id, patches, callback) {
    var nodeDOM = getNodeById(id);



    callback();
};
