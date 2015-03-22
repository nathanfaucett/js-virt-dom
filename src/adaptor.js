var renderString = require("./render_string"),
    createDOMElement = require("./utils/create_dom_element"),
    nodeCache = require("./utils/node_cache"),
    addDOMNodesToCache = require("./utils/add_dom_nodes_to_cache"),
    getNodeById = require("./utils/get_node_by_id"),
    applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(containerDOMNode, rootNode) {
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
    this.rootNode = rootNode;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.mount = function(parentId, id, index, view, callback) {
    var containerDOMNode, DOMNode, newDOMNode;

    if (parentId === null) {
        containerDOMNode = this.containerDOMNode;
        containerDOMNode.innerHTML = renderString(view, id);
        addDOMNodesToCache(containerDOMNode.childNodes);
    } else {
        DOMNode = getNodeById(parentId);

        newDOMNode = createDOMElement(view, id, this.ownerDocument, false);
        newDOMNode.innerHTML = renderString(view.children, id);
        addDOMNodesToCache(newDOMNode.childNodes);

        if (index !== undefined) {
            DOMNode.insertBefore(newDOMNode, DOMNode.childNodes[index]);
        } else {
            DOMNode.appendChild(newDOMNode);
        }
    }

    callback();
};

AdaptorPrototype.unmount = function(parentId, id, callback) {
    var DOMNode = getNodeById(id);

    if (DOMNode !== undefined) {
        DOMNode.parentNode.removeChild(DOMNode);
    } else {
        this.containerDOMNode.innerHTML = "";
    }

    callback();
};

AdaptorPrototype.update = function(patches, callback) {
    applyPatches(patches);
    callback();
};
