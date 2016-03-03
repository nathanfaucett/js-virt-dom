var virt = require("virt"),
    getNodeById = require("../utils/getNodeById");


var traverseAncestors = virt.traverseAncestors;


module.exports = handleEventDispatch;


function handleEventDispatch(childHash, events, topLevelType, targetId, event) {
    var target = childHash[targetId],
        eventType = events[topLevelType],
        global, i, il;

    if (eventType) {
        global = eventType.global;

        if (target) {
            target = target.component;
        } else {
            target = null;
        }
        if (global) {
            i = -1;
            il = global.length - 1;
            event.currentTarget = event.componentTarget = event.currentComponentTarget = target;
            while (i++ < il) {
                global[i](event);
            }
        }

        traverseAncestors(targetId, function traverseAncestor(currentTargetId) {
            if (eventType[currentTargetId]) {
                event.currentTarget = getNodeById(currentTargetId);
                event.componentTarget = target;
                event.currentComponentTarget = childHash[currentTargetId].component;
                eventType[currentTargetId](event);
                return event.returnValue;
            } else {
                return true;
            }
        });

        if (event && event.isPersistent !== true) {
            event.destroy();
        }
    }
}
