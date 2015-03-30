var has = require("has");


module.exports = applyEvents;


function applyEvents(events, eventHandler, remove) {
    if (remove !== true) {
        onEvents(events, eventHandler);
    } else {
        offEvents(events, eventHandler);
    }
}

function onEvents(events, eventHandler) {
    var localHas = has,
        id;

    for (id in events) {
        if (localHas(events, id)) {
            eventHandler.on(id, events[id]);
        }
    }
}

function offEvents(events, eventHandler) {
    var localHas = has,
        id;

    for (id in events) {
        if (localHas(events, id)) {
            eventHandler.off(id, events[id]);
        }
    }
}
