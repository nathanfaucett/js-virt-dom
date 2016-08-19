var getTransitionEvent = require("../getters/getTransitionEvent"),
    SyntheticEvent = require("./SyntheticEvent");


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticTransitionEventPrototype;


module.exports = SyntheticTransitionEvent;


function SyntheticTransitionEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getTransitionEvent(this, nativeEvent);
}
SyntheticEvent.extend(SyntheticTransitionEvent);
SyntheticTransitionEventPrototype = SyntheticTransitionEvent.prototype;

SyntheticTransitionEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.propertyName = null;
    this.elapsedTime = null;
    this.pseudoElement = null;
};

SyntheticTransitionEventPrototype.toJSON = function(json) {
    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.propertyName = this.propertyName;
    json.elapsedTime = this.elapsedTime;
    json.pseudoElement = this.pseudoElement;

    return json;
};
