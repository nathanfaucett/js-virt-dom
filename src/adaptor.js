var applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(containerDOMNode) {
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        ownerDocument = this.ownerDocument;

    applyPatches(transaction.patchIds, transaction.patchHash, containerDOMNode, ownerDocument);
    applyPatches(transaction.removeIds, transaction.removeHash, containerDOMNode, ownerDocument);

    callback();
};
