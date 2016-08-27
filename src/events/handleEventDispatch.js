var virt = require("@nathanfaucett/virt"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    getNodeById = require("../utils/getNodeById");


var traverseAncestors = virt.traverseAncestors;


module.exports = handleEventDispatch;


function handleEventDispatch(childHash, events, topLevelType, targetId, event) {
    var target = childHash[targetId],
        eventType = events[topLevelType],
        global, ret, i, il;

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
            while (i++ < il && ret !== false) {
                ret = global[i](event);
                if (!isNullOrUndefined(ret)) {
                    ret = event.returnValue;
                }
            }
        }

        traverseAncestors(targetId, function traverseAncestor(currentTargetId) {
            var ret;

            if (eventType[currentTargetId]) {
                event.currentTarget = getNodeById(currentTargetId);
                event.componentTarget = target;
                event.currentComponentTarget = childHash[currentTargetId].component;
                ret = eventType[currentTargetId](event);
                return !isNullOrUndefined(ret) ? ret : event.returnValue;
            } else {
                return true;
            }
        });

        if (event && event.isPersistent !== true) {
            event.destroy();
        }
    }
}