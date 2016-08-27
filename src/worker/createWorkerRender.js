var Messenger = require("@nathanfaucett/messenger"),
    isNull = require("@nathanfaucett/is_null"),
    MessengerWorkerAdapter = require("@nathanfaucett/messenger_worker_adapter"),
    eventHandlersById = require("../eventHandlersById"),
    nativeDOMHandlers = require("../nativeDOM/handlers"),
    eventHandlersById = require("../eventHandlersById"),
    getRootNodeId = require("../utils/getRootNodeId"),
    registerNativeComponentHandlers = require("../utils/registerNativeComponentHandlers"),
    getWindow = require("../utils/getWindow"),
    EventHandler = require("../events/EventHandler"),
    applyEvents = require("../applyEvents"),
    applyPatches = require("../applyPatches");


module.exports = createWorkerRender;


function createWorkerRender(url, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        messenger = new Messenger(new MessengerWorkerAdapter(url)),

        eventHandler = new EventHandler(messenger, document, window, false),

        rootId = null;

    messenger.on("virt.handleTransaction", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        if (isNull(rootId)) {
            rootId = getRootNodeId(containerDOMNode);
            eventHandlersById[rootId] = eventHandler;
        }

        callback();
    });

    messenger.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    messenger.on("virt.onGlobalEvent", function onHandle(topLevelType, callback) {
        eventHandler.listenTo("global", topLevelType);
        callback();
    });
    messenger.on("virt.offGlobalEvent", function onHandle(topLevelType, callback) {
        callback();
    });

    registerNativeComponentHandlers(messenger, nativeDOMHandlers);

    return messenger;
}