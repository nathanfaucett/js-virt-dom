var Messenger = require("messenger"),
    MessengerWorkerAdapter = require("messenger_worker_adapter"),
    nativeComponents = require("../nativeComponents"),
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

    messenger.on("__WorkerAdapter:handleTransaction__", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        callback();
    });

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        if (targetId) {
            nativeEvent.preventDefault();
        }

        messenger.emit("__WorkerAdapter:handleEventDispatch__", {
            currentScrollLeft: viewport.currentScrollLeft,
            currentScrollTop: viewport.currentScrollTop,
            topLevelType: topLevelType,
            nativeEvent: nativeEventToJSON(nativeEvent),
            targetId: targetId
        });
    };

    registerNativeComponentHandlers(messenger, nativeComponents);

    return messenger;
}
