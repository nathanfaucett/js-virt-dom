var Messenger = require("messenger"),
    isNull = require("is_null"),
    MessengerWorkerAdapter = require("messenger_worker_adapter"),
    eventHandlersById = require("../eventHandlersById"),
    nativeDOMHandlers = require("../nativeDOM/handlers"),
    eventHandlersById = require("../eventHandlersById"),
    getRootNodeId = require("../utils/getRootNodeId"),
    registerNativeComponentHandlers = require("../utils/registerNativeComponentHandlers"),
    getWindow = require("../utils/getWindow"),
    nativeEventToJSON = require("../utils/nativeEventToJSON"),
    EventHandler = require("../events/EventHandler"),
    applyEvents = require("../applyEvents"),
    applyPatches = require("../applyPatches");


module.exports = createWorkerRender;


function createWorkerRender(url, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        eventHandler = new EventHandler(document, window),
        viewport = eventHandler.viewport,

        messenger = new Messenger(new MessengerWorkerAdapter(url)),

        rootId = null;

    messenger.on("virt.dom.handleTransaction", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        if (isNull(rootId)) {
            rootId = getRootNodeId(containerDOMNode);
            eventHandlersById[rootId] = eventHandler;
        }

        callback();
    });

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        if (targetId) {
            nativeEvent.preventDefault();
        }

        messenger.emit("virt.dom.handleEventDispatch", {
            currentScrollLeft: viewport.currentScrollLeft,
            currentScrollTop: viewport.currentScrollTop,
            topLevelType: topLevelType,
            nativeEvent: nativeEventToJSON(nativeEvent),
            targetId: targetId
        });
    };

    eventHandler.handleResize = function handleDispatch(data) {
        messenger.emit("virt.resize", data);
    };

    messenger.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(undefined, eventHandler.getDimensions());
    });

    registerNativeComponentHandlers(messenger, nativeDOMHandlers);

    return messenger;
}
