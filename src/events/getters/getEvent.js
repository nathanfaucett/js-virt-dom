var getEventTarget = require("./getEventTarget");


module.exports = getEvent;


function getEvent(obj, nativeEvent, eventHandler) {
    obj.nativeEvent = nativeEvent;
    obj.type = nativeEvent.type;
    obj.target = getEventTarget(nativeEvent, eventHandler.window);
    obj.currentTarget = nativeEvent.currentTarget;
    obj.eventPhase = nativeEvent.eventPhase;
    obj.bubbles = nativeEvent.bubbles;
    obj.cancelable = nativeEvent.cancelable;
    obj.timeStamp = nativeEvent.timeStamp;
    obj.defaultPrevented = (
        nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false
    );
    obj.propagationStopped = false;
    obj.returnValue = nativeEvent.returnValue;
    obj.isTrusted = nativeEvent.isTrusted;
}
