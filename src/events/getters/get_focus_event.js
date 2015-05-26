module.exports = getFocusEvent;


function getFocusEvent(obj, nativeEvent) {
    obj.relatedTarget = nativeEvent.relatedTarget;
}
