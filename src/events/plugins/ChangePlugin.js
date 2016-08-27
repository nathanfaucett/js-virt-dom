var environment = require("@nathanfaucett/environment"),
    getEventTarget = require("../getters/getEventTarget"),
    SyntheticInputEvent = require("../syntheticEvents/SyntheticInputEvent"),
    consts = require("../consts");


var document = environment.document,

    isInputSupported = (function() {
        var testNode;

        try {
            testNode = document.createElement("input");
        } catch (e) {
            testNode = {};
        }

        return (
            "oninput" in testNode &&
            (!("documentMode" in document) || document.documentMode > 9)
        );
    }()),

    topLevelTypes = consts.topLevelTypes,
    ChangePluginPrototype;


module.exports = ChangePlugin;


function ChangePlugin(eventHandler) {
    var _this = this;

    this.eventHandler = eventHandler;

    this.currentTarget = null;
    this.currentTargetValue = null;
    this.currentTargetValueProp = null;

    this.newValueProp = {
        get: function get() {
            return _this.currentTargetValueProp.get.call(this);
        },
        set: function set(value) {
            _this.currentTargetValue = value;
            _this.currentTargetValueProp.set.call(this, value);
        }
    };

    this.onPropertyChange = function(nativeEvent) {
        return ChangePlugin_onPropertyChange(_this, nativeEvent);
    };
}
ChangePluginPrototype = ChangePlugin.prototype;

ChangePluginPrototype.events = [
    topLevelTypes.topChange
];

ChangePluginPrototype.dependencies = [
    topLevelTypes.topBlur,
    topLevelTypes.topFocus,
    topLevelTypes.topKeyDown,
    topLevelTypes.topKeyUp,
    topLevelTypes.topSelectionChange
];

ChangePluginPrototype.handle = function(topLevelType, nativeEvent /*, targetId, viewport */ ) {
    var target, currentTarget;

    if (!isInputSupported) {
        if (topLevelType === topLevelTypes.topFocus) {
            target = getEventTarget(nativeEvent, this.eventHandler.window);

            if (hasInputCapabilities(target)) {
                ChangePlugin_stopListening(this);
                ChangePlugin_startListening(this, target);
            }
        } else if (topLevelType === topLevelTypes.topBlur) {
            ChangePlugin_stopListening(this);
        } else if (
            topLevelType === topLevelTypes.topSelectionChange ||
            topLevelType === topLevelTypes.topKeyUp ||
            topLevelType === topLevelTypes.topKeyDown
        ) {
            currentTarget = this.currentTarget;

            if (currentTarget && currentTarget.value !== this.currentTargetValue) {
                this.currentTargetValue = currentTarget.value;
                this.dispatchEvent(currentTarget, nativeEvent);
            }
        }
    }
};

ChangePluginPrototype.dispatchEvent = function(target, nativeEvent) {
    var event = SyntheticInputEvent.create(nativeEvent, this.eventHandler);
    event.target = target;
    event.type = "change";
    this.eventHandler.dispatchEvent(topLevelTypes.topChange, event);
};

function ChangePlugin_startListening(_this, target) {
    _this.currentTarget = target;
    _this.currentTargetValue = target.value;
    _this.currentTargetValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, "value");
    Object.defineProperty(target, "value", _this.newValueProp);
    target.attachEvent("onpropertychange", _this.onPropertyChange);
}

function ChangePlugin_stopListening(_this) {
    var target = _this.currentTarget;

    if (target) {
        _this.currentTarget = null;
        _this.currentTargetValue = null;
        _this.currentTargetValueProp = null;
        delete target.value;
        target.detachEvent("onpropertychange", _this.onPropertyChange);
    }
}

function ChangePlugin_onPropertyChange(_this, nativeEvent) {
    var currentTarget = _this.currentTarget;

    if (
        nativeEvent.propertyName === "value" &&
        _this.currentTargetValue !== currentTarget.value
    ) {
        _this.currentTargetValue = currentTarget.value;
        _this.dispatchEvent(currentTarget, nativeEvent);
    }
}

function hasInputCapabilities(element) {
    return element.nodeName === "INPUT" || element.nodeName === "TEXTAREA";
}