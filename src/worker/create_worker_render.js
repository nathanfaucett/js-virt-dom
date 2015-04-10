var Messenger = require("messenger"),
    MessengerWorkerAdaptor = require("messenger_worker_adaptor"),
    has = require("has"),
    isNode = require("is_node"),
    isFunction = require("is_function"),
    bindNativeComponents = require("../native_components/bind_native_components"),
    getWindow = require("../utils/get_window"),
    EventHandler = require("../events/event_handler"),
    applyEvents = require("../apply_events"),
    applyPatches = require("../apply_patches");


var ignoreNativeEventProp = {
    path: true,
    view: true
};


module.exports = createWorkerRender;


function createWorkerRender(url, containerDOMNode) {
    var document = containerDOMNode.ownerDocument,
        window = getWindow(document),

        eventHandler = new EventHandler(document, window),
        viewport = eventHandler.viewport,

        messenger = new Messenger(new MessengerWorkerAdaptor(url));

    messenger.on("__WorkerAdaptor:handleTransaction__", function handleTransaction(transaction, callback) {

        applyPatches(transaction.patches, containerDOMNode, document);
        applyEvents(transaction.events, eventHandler);
        applyPatches(transaction.removes, containerDOMNode, document);

        callback();
    });

    eventHandler.handleDispatch = function(topLevelType, nativeEvent, targetId) {
        if (targetId) {
            nativeEvent.preventDefault();
        }

        messenger.emit("__WorkerAdaptor:handleEventDispatch__", {
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

function nativeEventToJSON(nativeEvent) {
    var json = {},
        localHas = has,
        key, value;


    for (key in nativeEvent) {
        if (localHas(nativeEvent, key)) {
            value = nativeEvent[key];

            if (ignoreNativeEventProp[key] !== true && !isNode(value) && !isFunction(value)) {
                json[key] = value;
            }
        }
    }

    return json;
}
