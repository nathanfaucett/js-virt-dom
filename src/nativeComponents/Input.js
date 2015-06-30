var virt = require("virt"),
    has = require("has");


var View = virt.View,
    Component = virt.Component,
    InputPrototype;


module.exports = Input;


virt.registerNativeComponent("input", Input);


function Input(props, children, context) {
    var _this = this;

    if (process.env.NODE_ENV !== "production") {
        if (children.length > 0) {
            throw new Error("Input: input can't have children");
        }
    }

    Component.call(this, props, children, context);

    this.onInput = function(e) {
        return _this.__onInput(e);
    };
    this.onChange = function(e) {
        return _this.__onChange(e);
    };
    this.setChecked = function(checked, callback) {
        return _this.__setChecked(checked, callback);
    };
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
Component.extend(Input, "input");
InputPrototype = Input.prototype;

Input.getDefaultProps = function() {
    return {
        type: "text"
    };
};

InputPrototype.componentDidMount = function() {
    if (this.props.autoFocus) {
        this.focus();
    }
};

InputPrototype.__update = function() {
    var props = this.props;

    if (props.type === "checkbox") {
        this.__setChecked(props.checked = !props.checked);
    }
    if (props.value != null) {
        this.__setValue(props.value = props.value);
    }
};

InputPrototype.__onInput = function(e) {
    if (this.props.onInput) {
        this.props.onInput(e);
    }
    this.__onChange(e);
};

InputPrototype.__onChange = function(e) {
    if (this.props.onChange) {
        this.props.onChange(e);
    }
    this.__update();
};

InputPrototype.__setChecked = function(checked, callback) {
    this.emitMessage("__Input:setChecked__", {
        id: this.getInternalId(),
        checked: !!checked
    }, callback);
};

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

InputPrototype.__blur = function(callback) {
    this.emitMessage("__Input:blur__", {
        id: this.getInternalId()
    }, callback);
};

InputPrototype.__getRenderProps = function() {
    var props = this.props,
        renderProps = {},
        key, value;

    for (key in props) {
        if (has(props, key)) {
            value = props[key];

            if (key === "checked" && !value) {
                continue;
            }

            renderProps[key] = props[key];
        }
    }

    renderProps.onChange = this.onChange;
    renderProps.onInput = this.onInput;

    return renderProps;
};

InputPrototype.render = function() {
    return new View("input", null, null, this.__getRenderProps(), this.children, null, null);
};
