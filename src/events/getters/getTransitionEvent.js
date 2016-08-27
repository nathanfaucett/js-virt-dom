module.exports = getTransitionEvent;


function getTransitionEvent(obj, nativeEvent) {
    obj.propertyName = nativeEvent.propertyName;
    obj.elapsedTime = nativeEvent.elapsedTime;
    obj.pseudoElement = nativeEvent.pseudoElement;
}