var consts = require("../events/consts"),
    findEventHandler = require("../utils/findEventHandler"),
    findDOMNode = require("../utils/findDOMNode");


var topLevelTypes = consts.topLevelTypes,
    topLevelToEvent = consts.topLevelToEvent,
    GLOBAL_IMAGE = typeof(Image) !== "undefined" ? new Image() : {},
    imageHandlers = exports;


imageHandlers["virt.dom.Image.mount"] = function(data, callback) {
    var id = data.id,
        eventHandler = findEventHandler(id),
        node = findDOMNode(id),
        localImage = GLOBAL_IMAGE,
        src, originalSrc;

    if (eventHandler && node) {
        eventHandler.addBubbledEvent(topLevelTypes.topLoad, topLevelToEvent.topLoad, node);
        eventHandler.addBubbledEvent(topLevelTypes.topError, topLevelToEvent.topError, node);

        src = data.src;
        localImage.src = src;
        originalSrc = localImage.src;

        if (src !== originalSrc) {
            node.src = src;
        }

        callback();
    } else {
        callback(new Error("events(data, callback): No DOM node found with id " + data.id));
    }
};

imageHandlers["virt.dom.Image.setSrc"] = function(data, callback) {
    var id = data.id,
        node = findDOMNode(id),
        localImage = GLOBAL_IMAGE,
        src;

    if (node) {
        src = data.src;
        localImage.src = src;
        originalSrc = localImage.src;

        if (src !== originalSrc) {
            node.src = src;
        }

        callback();
    } else {
        callback(new Error("events(data, callback): No DOM node found with id " + data.id));
    }
};
