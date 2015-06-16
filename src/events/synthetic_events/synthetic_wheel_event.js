var getWheelEvent = require("../getters/get_wheel_event"),
    SyntheticMouseEvent = require("./synthetic_mouse_event");


var SyntheticMouseEventPrototype = SyntheticMouseEvent.prototype,
    SyntheticWheelEventPrototype;


module.exports = SyntheticWheelEvent;


function SyntheticWheelEvent(nativeEvent, eventHandler) {

    SyntheticMouseEvent.call(this, nativeEvent, eventHandler);

    getWheelEvent(this, nativeEvent, eventHandler);
}
SyntheticMouseEvent.extend(SyntheticWheelEvent);
SyntheticWheelEventPrototype = SyntheticWheelEvent.prototype;

SyntheticWheelEventPrototype.destructor = function() {

    SyntheticMouseEventPrototype.destructor.call(this);

    this.deltaX = null;
    this.deltaY = null;
    this.deltaZ = null;
    this.deltaMode = null;
};

SyntheticWheelEventPrototype.toJSON = function(json) {

    json = SyntheticMouseEventPrototype.toJSON.call(this, json);

    json.deltaX = this.deltaX;
    json.deltaY = this.deltaY;
    json.deltaZ = this.deltaZ;
    json.deltaMode = this.deltaMode;

    return json;
};
