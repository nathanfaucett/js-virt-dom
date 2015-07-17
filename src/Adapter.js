var virt = require("virt"),
    Messenger = require("messenger"),
    createMessengerAdapter = require("messenger_adapter"),
    getWindow = require("./utils/getWindow"),
    nativeDOM = require("./nativeDOM"),
    registerNativeComponents = require("./utils/registerNativeComponents"),
    registerNativeComponentHandlers = require("./utils/registerNativeComponentHandlers"),
    getNodeById = require("./utils/getNodeById"),
    consts = require("./events/consts"),
    EventHandler = require("./events/EventHandler"),
    eventClassMap = require("./events/eventClassMap"),
    applyEvents = require("./applyEvents"),
    applyPatches = require("./applyPatches");


var traverseAncestors = virt.traverseAncestors;


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

    this.handle = function(transaction, callback) {
        messengerServer.emit("virt.dom.Adapter.handleTransaction", transaction, callback);
    };

    messengerClient.on("virt.dom.Adapter.handleTransaction", function onHandleTransaction(transaction, callback) {
        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);
        callback();
    });

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    eventHandler.handleDispatch = function handleDispatch(topLevelType, nativeEvent, targetId) {
        messengerServer.emit("virt.dom.Adapter.handleEventDispatch", {
            topLevelType: topLevelType,
            nativeEvent: nativeEvent,
            targetId: targetId
        });
    };

    messengerClient.on("virt.dom.Adapter.handleEventDispatch", function onHandleEventDispatch(data, callback) {
        var topLevelType = data.topLevelType,
            nativeEvent = data.nativeEvent,
            targetId = data.targetId,
            eventType = events[topLevelType],
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

        callback();
    });

    eventHandler.handleResize = function handleDispatch(data) {
        messengerClient.emit("virt.resize", data);
    };

    messengerClient.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    registerNativeComponents(root, nativeDOM.components);
    registerNativeComponentHandlers(messengerClient, nativeDOM.handlers);
}
