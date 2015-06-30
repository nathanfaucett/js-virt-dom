var virt = require("virt");


var View = virt.View,
    Component = virt.Component,
    TextAreaPrototype;


virt.registerNativeComponent("textarea", TextArea);


module.exports = TextArea;


function TextArea(props, children, context) {
    var _this = this;

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("TextArea: textarea can't have children, set prop.value instead");
        }
    }

    Component.call(this, props, children, context);

    this.getValue = function(callback) {
        return _this.__getValue(callback);
    };
    this.setValue = function(value, callback) {
        return _this.__setValue(value, callback);
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

TextAreaPrototype.componentDidMount = function() {
    if (this.props.autoFocus) {
        this.focus();
    }
};

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

TextAreaPrototype.__blur = function(callback) {
    this.emitMessage("__TextArea:blur__", {
        id: this.getInternalId()
    }, callback);
};

TextAreaPrototype.render = function() {
    return new View("textarea", null, null, this.props, this.children, null, null);
};
