var virt = require("virt"),
    Messenger = require("messenger"),
    MessengerWebSocketAdaptor = require("messenger_websocket_adaptor"),
    consts = require("../events/consts"),
    eventClassMap = require("../events/event_class_map");


var traverseAncestors = virt.traverseAncestors;


module.exports = WebSocketAdaptor;


function WebSocketAdaptor(root, socket, attachMessage, sendMessage) {
    var messenger = new Messenger(new MessengerWebSocketAdaptor(socket, attachMessage, sendMessage)),
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

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    messenger.on("__WebSocketAdaptor:handleEventDispatch__", function(data, callback) {
        var childHash = root.childHash,
            topLevelType = data.topLevelType,
            nativeEvent = data.nativeEvent,
            targetId = data.targetId,
            eventType = events[topLevelType],
            target = childHash[targetId],
            event;

        if (target) {
            target = target.component;
        } else {
            target = null;
        }

        viewport.currentScrollLeft = data.currentScrollLeft;
        viewport.currentScrollTop = data.currentScrollTop;

        traverseAncestors(targetId, function(currentTargetId) {
            if (eventType[currentTargetId]) {
                event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
                event.target = target;
                event.currentTarget = childHash[currentTargetId].component;
                eventType[currentTargetId](event);
                return event.returnValue;
            } else {
                return true;
            }
        });

        if (event && event.isPersistent !== true) {
            event.destroy();
        }

        callback(undefined);
    });

    this.handle = function(transaction, callback) {
        messenger.emit("__WebSocketAdaptor:handleTransaction__", transaction, callback);
    };
}