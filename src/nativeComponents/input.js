var virt = require("virt");


var View = virt.View,
    Component = virt.Component,
    InputPrototype;


module.exports = Input;


virt.registerNativeComponent("input", Input);


function Input(props, children, context) {
    var _this = this;

    Component.call(this, props, children, context);

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Input: input can't have children");
        }
    }

    this.getValue = function(callback) {
        return _this.__getValue(callback);
    };
    this.setValue = function(callback) {
        return _this.__setValue(callback);
    };
    this.focus = function(callback) {
        return _this.__focus(callback);
    };
    this.blur = function(callback) {
        return _this.__blur(callback);
    };
}
Component.extend(Input, "input");

InputPrototype = Input.prototype;

InputPrototype.__getValue = function(callback) {
    this.emitMessage("__Input:getValue__", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__setValue = function(value, callback) {
    this.emitMessage("__Input:setValue__", {
        id: this.getInternalId(),
        value: value
    }, callback);
};

InputPrototype.__focus = function(callback) {
    this.emitMessage("__Input:focus__", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__blur = function(value, callback) {
    this.emitMessage("__Input:blur__", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.render = function() {
    return new View("input", null, null, this.props, this.children, null, null);
};
