var applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(containerDOMNode) {
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(patches, callback) {
    applyPatches(patches, this.containerDOMNode, this.ownerDocument);
    callback();
};
