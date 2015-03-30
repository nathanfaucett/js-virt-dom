var has = require("has"),
    indexOf = require("index_of"),
    getPath = require("./getters/get_path"),
    getNodeById = require("../utils/get_node_by_id");


module.exports = handleEvent;


function handleEvent(topType, event, nativeEvent, events) {
    var path = getPath(nativeEvent),
        eventIds = events[topType],
        elements = getElements(eventIds),
        id, element;

    for (id in elements) {
        element = elements[id];

        if (indexOf(path, element) !== -1) {
            event.currentTarget = element;
            eventIds[id](event);
        }
    }

    if (event.destroy && event.isPersistent !== true) {
        event.destroy();
    }
}

function getElements(ids) {
    var elements = {},
        localHas = has,
        id;

    for (id in ids) {
        if (localHas(ids, id)) {
            elements[id] = getNodeById(id);
        }
    }

    return elements;
}
