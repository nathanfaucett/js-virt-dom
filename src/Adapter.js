var virt = require("virt"),
    extend = require("extend"),
    Messenger = require("messenger"),
    createMessengerAdapter = require("messenger_adapter"),
    eventHandlersById = require("./eventHandlersById"),
    getWindow = require("./utils/getWindow"),
    nativeDOMComponents = require("./nativeDOM/components"),
    nativeDOMHandlers = require("./nativeDOM/handlers"),
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

        propNameToTopLevel = consts.propNameToTopLevel,

        document = containerDOMNode.ownerDocument,
        window = getWindow(document),
        eventManager = root.eventManager,
        events = eventManager.events,
        eventHandler = new EventHandler(messengerClient, document, window, true);

    eventHandlersById[root.id] = eventHandler;

    this.messenger = messengerServer;
    this.messengerClient = messengerClient;

    this.root = root;
    this.containerDOMNode = containerDOMNode;

    this.document = document;
    this.window = getWindow(document);

    this.eventHandler = eventHandler;

    messengerClient.on("virt.handleTransaction", function onHandleTransaction(transaction, callback) {
        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);
        callback();
    });

    extend(eventManager.propNameToTopLevel, propNameToTopLevel);

    messengerServer.on("virt.dom.handleEventDispatch", function onHandleEventDispatch(data, callback) {
        var childHash = root.childHash,
            topLevelType = data.topLevelType,
            nativeEvent = data.nativeEvent,
            targetId = data.targetId,
            eventType = events[topLevelType],
            target = childHash[targetId],
            global = eventType.global,
            event, i, il;

        if (target) {
            target = target.component;
        } else {
            target = null;
        }

        if (global) {
            i = -1;
            il = global.length - 1;
            event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
            event.currentTarget = event.componentTarget = event.currentComponentTarget = target;
            while (i++ < il) {
                global[i](event);
            }
        }

        traverseAncestors(targetId, function traverseAncestor(currentTargetId) {
            if (eventType[currentTargetId]) {
                event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
                event.currentTarget = getNodeById(currentTargetId);
                event.componentTarget = target;
                event.currentComponentTarget = childHash[currentTargetId].component;
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

    messengerClient.on("virt.onGlobalEvent", function onHandle(topLevelType, callback) {
        eventHandler.listenTo("global", topLevelType);
        callback();
    });
    messengerClient.on("virt.offGlobalEvent", function onHandle(topLevelType, callback) {
        callback();
    });

    messengerClient.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    registerNativeComponents(root, nativeDOMComponents);
    registerNativeComponentHandlers(messengerClient, nativeDOMHandlers);
}
