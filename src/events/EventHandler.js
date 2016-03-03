var has = require("has"),
    eventListener = require("event_listener"),
    consts = require("./consts"),
    getWindowWidth = require("./getters/getWindowWidth"),
    getWindowHeight = require("./getters/getWindowHeight"),
    getEventTarget = require("./getters/getEventTarget"),
    getNodeAttributeId = require("../utils/getNodeAttributeId"),
    nativeEventToJSON = require("../utils/nativeEventToJSON"),
    isEventSupported = require("./isEventSupported"),
    TapPlugin = require("./plugins/TapPlugin");


var topLevelTypes = consts.topLevelTypes,
    topLevelToEvent = consts.topLevelToEvent,
    EventHandlerPrototype;


module.exports = EventHandler;


function EventHandler(messenger, document, window, isClient) {
    var _this = this,
        documentElement = document.documentElement ? document.documentElement : document.body,
        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        };

    this.document = document;
    this.documentElement = documentElement;
    this.window = window;
    this.viewport = viewport;
    this.messenger = messenger;
    this.isClient = !!isClient;

    this.__pluginListening = {};
    this.__pluginHash = {};
    this.__plugins = [];
    this.__isListening = {};
    this.__listening = {};

    function onViewport() {
        viewport.currentScrollLeft = window.pageXOffset || documentElement.scrollLeft;
        viewport.currentScrollTop = window.pageYOffset || documentElement.scrollTop;
    }
    this.__onViewport = onViewport;
    eventListener.on(window, "scroll resize orientationchange", onViewport);

    function onResize() {
        messenger.emit("virt.resize", _this.getDimensions());
    }
    this.__onResize = onResize;
    eventListener.on(window, "resize orientationchange", onResize);

    this.addPlugin(new TapPlugin(this));
}
EventHandlerPrototype = EventHandler.prototype;

EventHandlerPrototype.getDimensions = function() {
    var viewport = this.viewport,
        window = this.window,
        documentElement = this.documentElement,
        document = this.document;

    return {
        scrollLeft: viewport.currentScrollLeft,
        scrollTop: viewport.currentScrollTop,
        width: getWindowWidth(window, documentElement, document),
        height: getWindowHeight(window, documentElement, document)
    };
};

EventHandlerPrototype.addPlugin = function(plugin) {
    var plugins = this.__plugins,
        pluginHash = this.__pluginHash,
        events = plugin.events,
        i = -1,
        il = events.length - 1;

    while (i++ < il) {
        pluginHash[events[i]] = plugin;
    }

    plugins[plugins.length] = plugin;
};

EventHandlerPrototype.pluginListenTo = function(topLevelType) {
    var plugin = this.__pluginHash[topLevelType],
        pluginListening = this.__pluginListening,
        dependencies, events, i, il;

    if (plugin && !pluginListening[topLevelType]) {
        dependencies = plugin.dependencies;
        i = -1;
        il = dependencies.length - 1;

        while (i++ < il) {
            this.nativeListenTo(dependencies[i]);
        }

        events = plugin.events;
        i = -1;
        il = events.length - 1;

        while (i++ < il) {
            pluginListening[events[i]] = plugin;
        }

        return true;
    } else {
        return false;
    }
};

EventHandlerPrototype.clear = function() {
    var window = this.window,
        listening = this.__listening,
        isListening = this.__isListening,
        localHas = has,
        topLevelType;

    for (topLevelType in listening) {
        if (localHas(listening, topLevelType)) {
            listening[topLevelType]();
            delete listening[topLevelType];
            delete isListening[topLevelType];
        }
    }

    eventListener.off(window, "scroll resize orientationchange", this.__onViewport);
    eventListener.off(window, "resize orientationchange", this.__onResize);
};

EventHandlerPrototype.listenTo = function(id, topLevelType) {
    if (!this.pluginListenTo(topLevelType)) {
        this.nativeListenTo(topLevelType);
    }
};

EventHandlerPrototype.nativeListenTo = function(topLevelType) {
    var document = this.document,
        window = this.window,
        isListening = this.__isListening;

    if (!isListening[topLevelType]) {
        if (topLevelType === topLevelTypes.topWheel) {
            if (isEventSupported("wheel")) {
                this.trapBubbledEvent(topLevelTypes.topWheel, "wheel", document);
            } else if (isEventSupported("mousewheel")) {
                this.trapBubbledEvent(topLevelTypes.topWheel, "mousewheel", document);
            } else {
                this.trapBubbledEvent(topLevelTypes.topWheel, "DOMMouseScroll", document);
            }
        } else if (topLevelType === topLevelTypes.topScroll) {
            if (isEventSupported("scroll", true)) {
                this.trapCapturedEvent(topLevelTypes.topScroll, "scroll", document);
            } else {
                this.trapBubbledEvent(topLevelTypes.topScroll, "scroll", window);
            }
        } else if (
            topLevelType === topLevelTypes.topFocus ||
            topLevelType === topLevelTypes.topBlur
        ) {
            if (isEventSupported("focus", true)) {
                this.trapCapturedEvent(topLevelTypes.topFocus, "focus", document);
                this.trapCapturedEvent(topLevelTypes.topBlur, "blur", document);
            } else if (isEventSupported("focusin")) {
                this.trapBubbledEvent(topLevelTypes.topFocus, "focusin", document);
                this.trapBubbledEvent(topLevelTypes.topBlur, "focusout", document);
            }

            isListening[topLevelTypes.topFocus] = true;
            isListening[topLevelTypes.topBlur] = true;
        } else {
            this.trapBubbledEvent(topLevelType, topLevelToEvent[topLevelType], document);
        }

        isListening[topLevelType] = true;
    }
};

EventHandlerPrototype.addBubbledEvent = function(topLevelType, type, element) {
    var _this = this;

    function handler(nativeEvent) {
        _this.dispatchEvent(topLevelType, nativeEvent);
    }

    eventListener.on(element, type, handler);

    function removeBubbledEvent() {
        eventListener.off(element, type, handler);
    }

    return removeBubbledEvent;
};

EventHandlerPrototype.addCapturedEvent = function(topLevelType, type, element) {
    var _this = this;

    function handler(nativeEvent) {
        _this.dispatchEvent(topLevelType, nativeEvent);
    }

    eventListener.capture(element, type, handler);

    function removeCapturedEvent() {
        eventListener.off(element, type, handler);
    }

    return removeCapturedEvent;
};

EventHandlerPrototype.trapBubbledEvent = function(topLevelType, type, element) {
    var removeBubbledEvent = this.addBubbledEvent(topLevelType, type, element);
    this.__listening[topLevelType] = removeBubbledEvent;
    return removeBubbledEvent;
};

EventHandlerPrototype.trapCapturedEvent = function(topLevelType, type, element) {
    var removeCapturedEvent = this.addCapturedEvent(topLevelType, type, element);
    this.__listening[topLevelType] = removeCapturedEvent;
    return removeCapturedEvent;
};

EventHandlerPrototype.dispatchEvent = function(topLevelType, nativeEvent) {
    var isClient = this.isClient,
        targetId = getNodeAttributeId(getEventTarget(nativeEvent, this.window)),
        plugins = this.__plugins,
        i = -1,
        il = plugins.length - 1;

    if (!isClient && targetId) {
        nativeEvent.preventDefault();
    }

    while (i++ < il) {
        plugins[i].handle(topLevelType, nativeEvent, targetId, this.viewport);
    }

    this.messenger.emit("virt.dom.handleEventDispatch", {
        viewport: this.viewport,
        topLevelType: topLevelType,
        nativeEvent: isClient ? nativeEvent : nativeEventToJSON(nativeEvent),
        targetId: targetId
    });
};
