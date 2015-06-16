var getUIEvent = require("../getters/get_ui_event"),
    SyntheticEvent = require("./synthetic_event");


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticUIEventPrototype;


module.exports = SyntheticUIEvent;


function SyntheticUIEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getUIEvent(this, nativeEvent, eventHandler);
}
SyntheticEvent.extend(SyntheticUIEvent);
SyntheticUIEventPrototype = SyntheticUIEvent.prototype;

SyntheticUIEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.view = null;
    this.detail = null;
};

SyntheticUIEventPrototype.toJSON = function(json) {

    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.view = null;
    json.detail = this.detail;

    return json;
};
