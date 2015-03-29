var eventPropNames = require("./events/prop_names"),
    applyEvents = require("./apply_events"),
    applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(root, containerDOMNode) {
    root.eventManager.propNames = eventPropNames;
    this.root = root;
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        ownerDocument = this.ownerDocument;

    applyPatches(transaction.patches, containerDOMNode, ownerDocument);
    applyEvents(transaction.removeEvents, true);
    applyEvents(transaction.events, false);
    applyPatches(transaction.removes, containerDOMNode, ownerDocument);

    callback();
};
