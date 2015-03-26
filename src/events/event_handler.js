var eventListener = require("event_listener"),

    getWindow = require("../utils/get_window"),
    getNodeById = require("../utils/get_node_by_id");


var EventHandlerPrototype,

    captureEventHandlers = {
        blur: true,
        focus: true,
        error: true,
        load: true,
        resize: true,
        scroll: true
    },

    windowEventHandlers = {
        devicemotion: true
    };


module.exports = EventHandler;


function EventHandler(document) {
    var window = getWindow(document),
        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        };

    this.document = document;
    this.window = window;
    this.viewport = viewport;

    function callback() {
        viewport.currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        viewport.currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }

    eventListener.on(window, "scroll resize", callback);

    this.__capturedEvents = {};
    this.__events = {};
}

EventHandlerPrototype = EventHandler.prototype;

EventHandlerPrototype.on = function(id, type) {

};

EventHandlerPrototype.off = function(id, type) {

};
