var getWheelEvent = require("./getters/get_wheel_event"),
    SyntheticMouseEvent = require("./synthetic_mouse_event");


module.exports = SyntheticWheelEvent;


function SyntheticWheelEvent(nativeEvent, eventHandler) {

    SyntheticMouseEvent.call(this, nativeEvent, eventHandler);

    getWheelEvent(this, nativeEvent, eventHandler);
}
SyntheticMouseEvent.extend(SyntheticWheelEvent);
