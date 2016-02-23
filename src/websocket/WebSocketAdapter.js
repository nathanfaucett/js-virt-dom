var virt = require("virt"),
    extend = require("extend"),
    Messenger = require("messenger"),
    MessengerWebSocketAdapter = require("messenger_websocket_adapter"),
    nativeDOMComponents = require("../nativeDOM/components"),
    registerNativeComponents = require("../utils/registerNativeComponents"),
    consts = require("../events/consts"),
    eventClassMap = require("../events/eventClassMap");


var traverseAncestors = virt.traverseAncestors;


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

        viewport.currentScrollLeft = data.currentScrollLeft;
        viewport.currentScrollTop = data.currentScrollTop;

        if (global) {
            i = -1;
            il = global.length - 1;
            event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
            event.currentTarget = event.componentTarget = event.currentComponentTarget = target;
            while (i++ < il) {
                global[i](event);
            }
        }

        traverseAncestors(targetId, function(currentTargetId) {
            if (eventType[currentTargetId]) {
                event = event || eventClassMap[topLevelType].getPooled(nativeEvent, eventHandler);
                event.target = event.componentTarget = target;
                event.currentTarget = event.currentComponentTarget = childHash[currentTargetId].component;
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

    registerNativeComponents(root, nativeDOMComponents);
}
