module.exports = getPageX;


function getPageX(nativeEvent, viewport) {
    return nativeEvent.pageX != null ? nativeEvent.pageX : nativeEvent.clientX + viewport.currentScrollLeft;
}
