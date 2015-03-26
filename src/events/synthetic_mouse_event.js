var getMouseEvent = require("./getters/get_mouse_event"),
    SyntheticUIEvent = require("./synthetic_ui_event");


module.exports = SyntheticMouseEvent;


function SyntheticMouseEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getMouseEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticMouseEvent);

SyntheticMouseEvent.prototype.getModifierState = require("./getters/get_event_modifier_state");
