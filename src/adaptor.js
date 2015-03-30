var getWindow = require("./utils/get_window"),
    consts = require("./events/consts"),
    EventHandler = require("./events/event_handler"),
    handleEvent = require("./events/handle_event"),
    applyEvents = require("./apply_events"),
    applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(root, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),
        eventManager = root.eventManager,
        eventHandler = new EventHandler(document, window);

    this.root = root;
    this.containerDOMNode = containerDOMNode;

    this.document = document;
    this.window = getWindow(document);

    this.eventHandler = eventHandler;

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    eventHandler.handleDispatch = function(topType, event, nativeEvent) {
        handleEvent(topType, event, nativeEvent, eventManager.__events);
    };
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        eventHandler = this.eventHandler,
        document = this.document;

    applyPatches(transaction.patches, containerDOMNode, document);
    applyEvents(transaction.events, eventHandler, false);
    applyEvents(transaction.eventsRemove, eventHandler, true);
    applyPatches(transaction.removes, containerDOMNode, document);

    callback();
};
