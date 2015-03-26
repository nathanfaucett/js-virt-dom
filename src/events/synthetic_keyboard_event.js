var getKeyboardEvent = require("./getters/get_keyboard_event"),
    SyntheticUIEvent = require("./synthetic_ui_event");


module.exports = SynthetiKeyboardEvent;


function SynthetiKeyboardEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getKeyboardEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SynthetiKeyboardEvent);

SynthetiKeyboardEvent.prototype.getModifierState = require("./getters/get_event_modifier_state");
