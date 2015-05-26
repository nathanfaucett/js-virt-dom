var has = require("has");


module.exports = applyEvents;


function applyEvents(events, eventHandler) {
    var localHas = has,
        id;

    for (id in events) {
        if (localHas(events, id)) {
            eventHandler.listenTo(id, events[id]);
        }
    }
}
