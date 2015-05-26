var Messenger = require("messenger"),
    MessengerWebSocketAdaptor = require("messenger_websocket_adaptor"),
    bindNativeComponents = require("../native_components/bind_native_components"),
    getWindow = require("../utils/get_window"),
    nativeEventToJSON = require("../utils/native_event_to_json"),
    EventHandler = require("../events/event_handler"),
    applyEvents = require("../apply_events"),
    applyPatches = require("../apply_patches");


module.exports = createWebSocketRender;


function createWebSocketRender(containerDOMNode, socket, attachMessage, sendMessage) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        eventHandler = new EventHandler(document, window),
        viewport = eventHandler.viewport,

        messenger = new Messenger(new MessengerWebSocketAdaptor(socket, attachMessage, sendMessage));

    messenger.on("__WebSocketAdaptor:handleTransaction__", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        callback();
    });

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        if (targetId) {
            nativeEvent.preventDefault();
        }

        messenger.emit("__WebSocketAdaptor:handleEventDispatch__", {
            currentScrollLeft: viewport.currentScrollLeft,
            currentScrollTop: viewport.currentScrollTop,
            topLevelType: topLevelType,
            nativeEvent: nativeEventToJSON(nativeEvent),
            targetId: targetId
        });
    };

    bindNativeComponents(messenger);

    return messenger;
}
