var getTouchEvent = require("./getters/get_touch_event"),
    SyntheticUIEvent = require("./synthetic_ui_event"),
    SyntheticTouch = require("./synthetic_touch");


var SyntheticUIEventPrototype = SyntheticUIEvent.prototype;


module.exports = SyntheticTouchEvent;


function SyntheticTouchEvent(nativeEvent, eventHandler) {

    SyntheticUIEvent.call(this, nativeEvent, eventHandler);

    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];

    getTouchEvent(this, nativeEvent, eventHandler);
}
SyntheticUIEvent.extend(SyntheticTouchEvent);

SyntheticTouchEvent.prototype.getModifierState = require("./getters/get_event_modifier_state");
