var getTouch = require("./getters/get_touch"),
    createPool = require("create_pool");


module.exports = SyntheticTouch;


function SyntheticTouch(nativeTouch, eventHandler) {
    getTouch(this, nativeTouch, eventHandler);
}
createPool(SyntheticTouch);

SyntheticTouch.create = function(nativeTouch, eventHandler) {
    return this.getPooled(nativeTouch, eventHandler);
};

SyntheticTouch.destroy = function(instance) {
    this.release(instance);
};

SyntheticTouch.prototype.destructor = function() {
    this.nativeTouch = null;
    this.identifier = null;
    this.screenX = null;
    this.screenY = null;
    this.clientX = null;
    this.clientY = null;
    this.pageX = null;
    this.pageY = null;
    this.radiusX = null;
    this.radiusY = null;
    this.rotationAngle = null;
    this.force = null;
    this.target = null;
};
