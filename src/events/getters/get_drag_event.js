module.exports = getDragEvent;


function getDragEvent(obj, nativeEvent, viewport) {
    obj.dataTransfer = nativeEvent.dataTransfer;
}
