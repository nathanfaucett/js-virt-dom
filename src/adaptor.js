var traverseAncestors = require("virt/utils/traverse_ancestors"),
    getWindow = require("./utils/get_window"),
    getNodeById = require("./utils/get_node_by_id"),
    consts = require("./events/consts"),
    EventHandler = require("./events/event_handler"),
    eventClassMap = require("./events/event_class_map"),
    applyEvents = require("./apply_events"),
    applyPatches = require("./apply_patches");


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(root, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),
        eventManager = root.eventManager,
        events = eventManager.__events,
        eventHandler = new EventHandler(document, window);

    this.root = root;
    this.containerDOMNode = containerDOMNode;

    this.document = document;
    this.window = getWindow(document);

    this.eventHandler = eventHandler;

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        var eventType = events[topLevelType],
            event;

        traverseAncestors(targetId, function(currentTargetId) {
            if (eventType[currentTargetId]) {
                event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
                event.currentTarget = getNodeById(currentTargetId);
                eventType[currentTargetId](event);
                return event.returnValue;
            } else {
                return true;
            }
        });

        if (event && event.isPersistent !== true) {
            event.destroy();
        }
    };
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        eventHandler = this.eventHandler,
        document = this.document;

    applyPatches(transaction.patches, containerDOMNode, document);
    applyEvents(transaction.events, eventHandler);
    applyPatches(transaction.removes, containerDOMNode, document);

    callback();
};
