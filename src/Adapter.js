var extend = require("extend"),
    Messenger = require("messenger"),
    createMessengerAdapter = require("messenger_adapter"),
    eventHandlersById = require("./eventHandlersById"),
    getWindow = require("./utils/getWindow"),
    nativeDOMComponents = require("./nativeDOM/components"),
    nativeDOMHandlers = require("./nativeDOM/handlers"),
    registerNativeComponents = require("./utils/registerNativeComponents"),
    registerNativeComponentHandlers = require("./utils/registerNativeComponentHandlers"),
    consts = require("./events/consts"),
    EventHandler = require("./events/EventHandler"),
    eventClassMap = require("./events/eventClassMap"),
    handleEventDispatch = require("./events/handleEventDispatch"),
    applyEvents = require("./applyEvents"),
    applyPatches = require("./applyPatches");


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
        var topLevelType = data.topLevelType;

        handleEventDispatch(
            root.childHash,
            events,
            topLevelType,
            data.targetId,
            eventClassMap[topLevelType].getPooled(data.nativeEvent, eventHandler)
        );

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
