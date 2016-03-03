module.exports = getAnimationEvent;


function getAnimationEvent(obj, nativeEvent) {
    obj.animationName = nativeEvent.animationName;
    obj.elapsedTime = nativeEvent.elapsedTime;
    obj.pseudoElement = nativeEvent.pseudoElement;
}
