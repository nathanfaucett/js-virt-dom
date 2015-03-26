var getEventTarget = require("./get_event_target");


module.exports = getEvent;


function getEvent(obj, nativeEvent) {
    obj.nativeEvent = nativeEvent;
    obj.type = nativeEvent.type;
    obj.target = getEventTarget(nativeEvent);
    obj.currentTarget = nativeEvent.currentTarget;
    obj.eventPhase = nativeEvent.eventPhase;
    obj.bubbles = nativeEvent.bubbles;
    obj.cancelable = nativeEvent.cancelable;
    obj.timeStamp = nativeEvent.timeStamp;
    obj.defaultPrevented = (
        nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false
    );
    obj.propagationStopped = false;
    obj.isTrusted = nativeEvent.isTrusted;
}
