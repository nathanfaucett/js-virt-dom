var getAnimationEvent = require("../getters/getAnimationEvent"),
    SyntheticEvent = require("./SyntheticEvent");


var SyntheticEventPrototype = SyntheticEvent.prototype,
    SyntheticAnimationEventPrototype;


module.exports = SyntheticAnimationEvent;


function SyntheticAnimationEvent(nativeEvent, eventHandler) {

    SyntheticEvent.call(this, nativeEvent, eventHandler);

    getAnimationEvent(this, nativeEvent);
}
SyntheticEvent.extend(SyntheticAnimationEvent);
SyntheticAnimationEventPrototype = SyntheticAnimationEvent.prototype;

SyntheticAnimationEventPrototype.destructor = function() {

    SyntheticEventPrototype.destructor.call(this);

    this.animationName = null;
    this.elapsedTime = null;
    this.pseudoElement = null;
};

SyntheticAnimationEventPrototype.toJSON = function(json) {
    json = SyntheticEventPrototype.toJSON.call(this, json);

    json.animationName = this.animationName;
    json.elapsedTime = this.elapsedTime;
    json.pseudoElement = this.pseudoElement;

    return json;
};