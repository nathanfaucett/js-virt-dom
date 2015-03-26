var applyPatches = require("./apply_patches"),
    EventHandler = require("./events/event_handler");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(containerDOMNode) {
    this.root = null;
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
    this.eventHandler = new EventHandler(this.ownerDocument);
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handleEvent = function(event, callback) {
    callback(event);
};

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        ownerDocument = this.ownerDocument,
        eventHandler = this.eventHandler;

    applyPatches(transaction.patchIds, transaction.patchHash, containerDOMNode, ownerDocument, eventHandler);
    applyPatches(transaction.removeIds, transaction.removeHash, containerDOMNode, ownerDocument, eventHandler);

    callback();
};
