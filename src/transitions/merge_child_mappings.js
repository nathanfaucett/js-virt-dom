var has = require("has");


module.exports = mergeChildMappings;


function mergeChildMappings(prev, next) {
    var nextKeysPending = {},
        pendingKeys = [],
        childMapping = {},
        prevKey, nextKey, i, il, nextKeysPendingValue, pendingNextKey;

    prev = prev || {};
    next = next || {};

    for (prevKey in prev) {
        if (has(next, prevKey)) {
            if (pendingKeys.length) {
                nextKeysPending[prevKey] = pendingKeys;
                pendingKeys = [];
            }
        } else {
            pendingKeys.push(prevKey);
        }
    }

    for (nextKey in next) {
        if (has(nextKeysPending, nextKey)) {
            nextKeysPendingValue = nextKeysPending[nextKey];
            i = -1;
            il = nextKeysPendingValue.length - 1;

            while (i++ < il) {
                pendingNextKey = nextKeysPendingValue[i];
                childMapping[pendingNextKey] = has(next, pendingNextKey) ? next[pendingNextKey] : prev[pendingNextKey];
            }
        }
        childMapping[nextKey] = has(next, nextKey) ? next[nextKey] : prev[nextKey]; //getValueForKey(nextKey);
    }

    i = -1;
    il = pendingKeys.length - 1;
    while (i++ < il) {
        nextKey = pendingKeys[i];
        childMapping[nextKey] = has(next, nextKey) ? next[nextKey] : prev[nextKey];
    }

    return childMapping;
}
