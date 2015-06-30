var virt = require("virt");


var View = virt.View,
    Component = virt.Component,
    TextAreaPrototype;


virt.registerNativeComponent("textarea", TextArea);


function TextArea(props, children, context) {
    var _this = this;

    Component.call(this, props, children, context);

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("TextArea: textarea can't have children");
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
Component.extend(TextArea, "textarea");

TextAreaPrototype = TextArea.prototype;

TextAreaPrototype.__getValue = function(callback) {
    this.emitMessage("__TextArea:getValue__", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__setValue = function(value, callback) {
    this.emitMessage("__TextArea:setValue__", {
        id: this.getInternalId(),
        value: value
    }, callback);
};

TextAreaPrototype.__focus = function(callback) {
    this.emitMessage("__TextArea:focus__", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.__blur = function(value, callback) {
    this.emitMessage("__TextArea:blur__", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.render = function() {
    return new View("textarea", null, null, this.props, this.children, null, null);
};
