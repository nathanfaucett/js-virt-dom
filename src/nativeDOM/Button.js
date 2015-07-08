var virt = require("virt"),
    indexOf = require("index_of"),
    has = require("has");


var View = virt.View,
    Component = virt.Component,

    mouseListenerNames = [
        "onClick",
        "onDoubleClick",
        "onMouseDown",
        "onMouseMove",
        "onMouseUp",

        "onClickCapture",
        "onDoubleClickCapture",
        "onMouseDownCapture",
        "onMouseMoveCapture",
        "onMouseUpCapture"
    ],

    ButtonPrototype;


virt.registerNativeComponent("button", Button);


module.exports = Button;


function Button(props, children, context) {
    var _this = this,
        localHas = has,
        nativeProps = {},
        key;

    if (props.disabled) {
        localHas = has;
        nativeProps = {};

        for (key in props) {
            if (localHas(props, key) && indexOf(mouseListenerNames, key) === -1) {
                nativeProps[key] = props[key];
            }
        }
        nativeProps.disabled = true;
    } else {
        for (key in props) {
            if (localHas(props, key) && key !== "disabled") {
                nativeProps[key] = props[key];
            }
        }
    }

    Component.call(this, props, children, context);

    this.focus = function(e) {
        return _this.__focus(e);
    };
    this.blur = function(e) {
        return _this.__blur(e);
    };
}
Component.extend(Button, "button");
ButtonPrototype = Button.prototype;

ButtonPrototype.componentDidMount = function() {
    if (this.props.autoFocus) {
        this.focus();
    }
};

ButtonPrototype.__focus = function(callback) {
    this.emitMessage("virt.dom.Button.focus", {
        id: this.getInternalId()
    }, callback);
};

ButtonPrototype.__blur = function(callback) {
    this.emitMessage("virt.dom.Button.blur", {
        id: this.getInternalId()
    }, callback);
};

ButtonPrototype.__getRenderProps = function() {
    var props = this.props,
        localHas = has,
        renderProps = {},
        key;

    if (props.disabled) {
        localHas = has;
        renderProps = {};

        for (key in props) {
            if (localHas(props, key) && indexOf(mouseListenerNames, key) === -1) {
                renderProps[key] = props[key];
            }
        }

        renderProps.disabled = true;
    } else {
        for (key in props) {
            if (localHas(props, key) && key !== "disabled") {
                renderProps[key] = props[key];
            }
        }
    }

    return renderProps;
};

ButtonPrototype.render = function() {
    return new View("button", null, null, this.__getRenderProps(), this.children, null, null);
};
