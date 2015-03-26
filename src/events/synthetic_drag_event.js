var getDragEvent = require("./getters/get_drag_event"),
    SyntheticMouseEvent = require("./synthetic_mouse_event");


module.exports = SyntheticDragEvent;


function SyntheticDragEvent(nativeEvent, eventHandler) {

    SyntheticMouseEvent.call(this, nativeEvent, eventHandler);

    getDragEvent(this, nativeEvent, eventHandler);
}

SyntheticMouseEvent.extend(SyntheticDragEvent);
