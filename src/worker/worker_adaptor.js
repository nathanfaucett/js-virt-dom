var Messenger = require("messenger"),
    traverseAncestors = require("virt/utils/traverse_ancestors"),
    consts = require("../events/consts"),
    eventClassMap = require("../events/event_class_map");


module.exports = Adaptor;


function Adaptor(root) {
    var messenger = new Messenger(new Messenger.AdaptorWebWorker()),
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
        events = eventManager.__events;

    this.root = root;

    eventManager.propNameToTopLevel = consts.propNameToTopLevel;

    messenger.on("handle_event_dispatch", function(data, callback) {
        var childHash = root.childHash,
            topLevelType = data.topLevelType,
            nativeEvent = data.nativeEvent,
            targetId = data.targetId,
            eventType = events[topLevelType],
            target = childHash[targetId].component,
            event;

        viewport.currentScrollLeft = data.currentScrollLeft,
            viewport.currentScrollTop = data.currentScrollTop,

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
        messenger.emit("handle_transaction", transaction, callback);
    };
}
