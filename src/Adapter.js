var virt = require("virt"),
    Messenger = require("messenger"),
    createMessengerAdapter = require("messenger_adapter"),
    getWindow = require("./utils/getWindow"),
    nativeComponents = require("./nativeComponents"),
    registerNativeComponents = require("./utils/registerNativeComponents"),
    registerNativeComponentHandlers = require("./utils/registerNativeComponentHandlers"),
    getNodeById = require("./utils/getNodeById"),
    consts = require("./events/consts"),
    EventHandler = require("./events/EventHandler"),
    eventClassMap = require("./events/eventClassMap"),
    applyEvents = require("./applyEvents"),
    applyPatches = require("./applyPatches");


var traverseAncestors = virt.traverseAncestors,
    AdapterPrototype;


module.exports = Adapter;


function Adapter(root, containerDOMNode) {
    var socket = createMessengerAdapter(),
        messengerClient = new Messenger(socket.client),
        messengerServer = new Messenger(socket.server),

        document = containerDOMNode.ownerDocument,
        window = getWindow(document),
        eventManager = root.eventManager,
        events = eventManager.events,
        eventHandler = new EventHandler(document, window);

    this.messenger = messengerServer;
    this.messengerClient = messengerClient;

    this.root = root;
    this.containerDOMNode = containerDOMNode;

    this.document = document;
    this.window = getWindow(document);

    this.eventHandler = eventHandler;

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        var eventType = events[topLevelType],
            event;

        traverseAncestors(targetId, function traverseAncestor(currentTargetId) {
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

    registerNativeComponents(root, nativeComponents);
    registerNativeComponentHandlers(messengerClient, nativeComponents);
}

AdapterPrototype = Adapter.prototype;

AdapterPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        eventHandler = this.eventHandler,
        document = this.document;

    applyPatches(transaction.patches, containerDOMNode, document);
    applyEvents(transaction.events, eventHandler);
    applyPatches(transaction.removes, containerDOMNode, document);

    callback();
};
