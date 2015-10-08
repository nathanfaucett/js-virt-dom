var consts = require("../events/consts"),
    findEventHandler = require("../utils/findEventHandler"),
    findDOMNode = require("../utils/findDOMNode");


var topLevelTypes = consts.topLevelTypes,
    topLevelToEvent = consts.topLevelToEvent,
    imageHandlers = exports;


imageHandlers["virt.dom.Image.mount"] = function(data, callback) {
    var id = data.id,
        eventHandler = findEventHandler(id),
        node = findDOMNode(id),
        src;

    if (eventHandler && node) {
        eventHandler.addBubbledEvent(topLevelTypes.topLoad, topLevelToEvent.topLoad, node);
        eventHandler.addBubbledEvent(topLevelTypes.topError, topLevelToEvent.topError, node);

        src = data.src;
        if (node.src !== src) {
            node.src = src;
        }

        callback();
    } else {
        callback(new Error("events(data, callback): No DOM node found with id " + data.id));
    }
};
