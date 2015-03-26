var getFocusEvent = require("./getters/get_focus_event"),
    SyntheticUIEvent = require("./synthetic_ui_event");


module.exports = SyntheticFocusEvent;


function SyntheticFocusEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    getFocusEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticFocusEvent);
