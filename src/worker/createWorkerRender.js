var Messenger = require("messenger"),
    MessengerWorkerAdapter = require("messenger_worker_adapter"),
    nativeDOM = require("../nativeDOM"),
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

        messenger = new Messenger(new MessengerWorkerAdapter(url));

    messenger.on("virt.dom.WorkerAdapter.handleTransaction", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        callback();
    });

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        if (targetId) {
            nativeEvent.preventDefault();
        }

        messenger.emit("virt.dom.WorkerAdapter.handleEventDispatch", {
            currentScrollLeft: viewport.currentScrollLeft,
            currentScrollTop: viewport.currentScrollTop,
            topLevelType: topLevelType,
            nativeEvent: nativeEventToJSON(nativeEvent),
            targetId: targetId
        });
    };

    eventHandler.handleResize = function handleResize(dimensions) {
        messenger.emit("virt.resize", dimensions);
    };

    messenger.on("virt.getDeviceDimensions", function getDeviceDimensions(data, callback) {
        callback(eventHandler.getDimensions());
    });

    registerNativeComponentHandlers(messenger, nativeDOM.handlers);

    return messenger;
}
