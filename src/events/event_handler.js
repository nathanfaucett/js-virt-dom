var keys = require("keys"),
    indexOf = require("index_of"),
    eventListener = require("event_listener"),

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


function EventHandler(adaptor, document) {
    var window = getWindow(document),
        viewport = {
            currentScrollLeft: 0,
            currentScrollTop: 0
        };

    this.adaptor = adaptor;

    this.document = document;
    this.window = window;
    this.viewport = viewport;

    function callback() {
        viewport.currentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        viewport.currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }

    eventListener.on(window, "scroll resize", callback);

    this.__captured = {};
    this.__handlers = {};
    this.__count = {};
    this.__ids = {};
}

EventHandlerPrototype = EventHandler.prototype;

EventHandlerPrototype.on = function(id, type) {
    var count = this.__count,
        ids = this.__ids,
        captured, eventList;

    if (captureEventHandlers[type] === undefined) {
        if (count[type] === undefined) {
            this.__handlers[type] = createEventHandler(
                this, type, windowEventHandlers[type] ? this.window : this.document, false
            );
            count[type] = 1;
        } else {
            count[type] += 1;
        }
    } else {
        captured = this.__captured[type] || (this.__captured[type] = {});

        if (captured[id] === undefined) {
            captured[id] = createEventHandler(this, type, getNodeById(id), true);
        }
    }

    eventList = ids[id] || (ids[id] = []);
    eventList[eventList.length] = type;
};

EventHandlerPrototype.off = function(id, type) {
    var count = this.__count,
        ids = this.__ids,
        handlers, captured, eventList;

    if (captureEventHandlers[type] === undefined) {
        if (count[type] !== undefined) {
            count[type] -= 1;

            if (count[type] === 0) {
                handlers = this.__handlers;
                eventListener.off(windowEventHandlers[type] ? this.window : this.document, type, handlers[type]);
                delete handlers[type];
                delete count[type];
            }
        }
    } else {
        captured = this.__captured[type];

        if (captured !== undefined && captured[id] !== undefined) {
            eventListener.off(getNodeById(id), type, captured[id]);
            delete captured[id];
        }
    }

    eventList = ids[id];

    if (eventList !== undefined) {
        eventList.splice(indexOf(eventList, type), 1);

        if (eventList.length === 0) {
            delete ids[id];
        }
    }
};

EventHandlerPrototype.allOff = function() {
    var ids = keys(this.__ids),
        i = -1,
        il = ids.length - 1;

    while (i++ < il) {
        console.log(ids[i]);
    }
};

function createEventHandler(_this, type, element, capture) {
    var adaptor = _this.adaptor;

    function handler(e) {
        adaptor.emitEvent(type, e);
    }

    if (capture) {
        eventListener.capture(element, type, handler);
    } else {
        eventListener.on(element, type, handler);
    }

    return handler;
}
