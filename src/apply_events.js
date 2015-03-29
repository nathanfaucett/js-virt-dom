var has = require("has");


module.exports = applyEvents;


function applyEvents(events, remove) {
    if (remove !== true) {
        addEvents(events);
    } else {
        removeEvents(events);
    }
}

function addEvents(events) {
    var id, type;

    for (id in events) {
        if (has(events, id)) {
            type = events[id];
        }
    }
}

function removeEvents(events) {
    var id, type;

    for (id in events) {
        if (has(events, id)) {
            type = events[id];
        }
    }
}
