module.exports = applyEvents;


function applyEvents(events, eventHandler) {
    var id, eventArray, i, il;

    for (id in events) {
        eventArray = events[id];
        i = -1;
        il = eventArray.length - 1;

        while (i++ < il) {
            eventHandler.listenTo(id, eventArray[i]);
        }
    }
}