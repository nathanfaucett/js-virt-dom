var inherits = require("inherits"),
    createPool = require("create_pool"),
    getEvent = require("/getters/get_event");


module.exports = SyntheticEvent;


function SyntheticEvent(nativeEvent, eventHandler) {
    getEvent(this, nativeEvent, eventHandler);
}
createPool(SyntheticEvent);

SyntheticEvent.create = function create(nativeTouch, eventHandler) {
    return this.getPooled(nativeTouch, eventHandler);
};

SyntheticEvent.prototype.destroy = function() {
    this.constructor.release(this);
};

SyntheticEvent.extend = function(child) {
    inherits(child, this);
    createPool(child);
    return child;
};

SyntheticEvent.prototype.preventDefault = function() {
    var event = this.nativeEvent;

    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }

    this.defaultPrevented = true;
};

SyntheticEvent.prototype.stopPropagation = function() {
    var event = this.nativeEvent;

    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = false;
    }

    this.propagationStopped = true;
};

SyntheticEvent.prototype.persist = function() {
    this.isPersistent = true;
};

SyntheticEvent.prototype.stopImmediatePropagation = SyntheticEvent.prototype.stopPropagation;
