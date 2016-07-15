var extend = require("@nathanfaucett/extend"),
    Messenger = require("@nathanfaucett/messenger"),
    MessengerWebSocketAdapter = require("@nathanfaucett/messenger_websocket_adapter"),
    handleEventDispatch = require("../events/handleEventDispatch"),
    nativeDOMComponents = require("../nativeDOM/components"),
    registerNativeComponents = require("../utils/registerNativeComponents"),
    consts = require("../events/consts"),
    eventClassMap = require("../events/eventClassMap");


module.exports = WebSocketAdapter;


function WebSocketAdapter(root, socket, attachMessage, sendMessage) {
    var messenger = new Messenger(new MessengerWebSocketAdapter(socket, attachMessage, sendMessage)),

        eventManager = root.eventManager,

        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        },
        eventHandler = {
            window: global,
            document: global,
            viewport: viewport
        },

        events = eventManager.events;

    this.root = root;
    this.messenger = messenger;

    extend(eventManager.propNameToTopLevel, consts.propNameToTopLevel);

    messenger.on("virt.dom.handleEventDispatch", function(data, callback) {
        var topLevelType = data.topLevelType,
            dataViewport = data.viewport;

        viewport.currentScrollLeft = dataViewport.currentScrollLeft;
        viewport.currentScrollTop = dataViewport.currentScrollTop;

        handleEventDispatch(
            root.childHash,
            events,
            topLevelType,
            data.targetId,
            eventClassMap[topLevelType].getPooled(data.nativeEvent, eventHandler)
        );

        callback();
    });

    registerNativeComponents(root, nativeDOMComponents);
}
