(function(dependencies, global) {
    var cache = [];

    function require(index) {
        var module = cache[index],
            callback, exports;

        if (module !== undefined) {
            return module.exports;
        } else {
            callback = dependencies[index];
            exports = {};

            cache[index] = module = {
                exports: exports,
                require: require
            };

            callback.call(exports, require, exports, module, global);
            return module.exports;
        }
    }

    require.resolve = function(path) {
        return path;
    };

    if (typeof(define) === "function" && define.amd) {
        define([], function() {
            return require(0);
        });
    } else if (typeof(module) !== "undefined" && module.exports) {
        module.exports = require(0);
    } else {
        
        require(0);
        
    }
}([
function(require, exports, module, global) {

var environment = require(1),
    eventListener = require(2),
    virt = require(8),
    virtDOM = require(42),
    App = require(52);


var app = document.getElementById("app");


eventListener.on(environment.window, "load", function() {
    virtDOM(virt.createView(App), app);
});


},
function(require, exports, module, global) {

var environment = module.exports,

    hasWindow = typeof(window) !== "undefined",
    userAgent = hasWindow ? window.navigator.userAgent : "";


environment.browser = !!(
    hasWindow &&
    typeof(navigator) !== "undefined" &&
    window.document
);

environment.node = !environment.browser;

environment.mobile = environment.browser && /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());

environment.window = (
    hasWindow ? window :
    typeof(global) !== "undefined" ? global :
    typeof(self) !== "undefined" ? self : {}
);

environment.pixelRatio = environment.window.devicePixelRatio || 1;

environment.document = typeof(document) !== "undefined" ? document : {};

environment.isInWorker = typeof(importScripts) !== "undefined";


},
function(require, exports, module, global) {

var process = require(3);
var isObject = require(4),
    isFunction = require(5),
    environment = require(1),
    eventTable = require(6);


var eventListener = module.exports,

    reSpliter = /[\s]+/,

    window = environment.window,
    document = environment.document,

    listenToEvent, captureEvent, removeEvent, dispatchEvent;


window.Event = window.Event || function EmptyEvent() {};


eventListener.on = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        listenToEvent(target, eventTypes[i], callback);
    }
};

eventListener.capture = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        captureEvent(target, eventTypes[i], callback);
    }
};

eventListener.off = function(target, eventType, callback) {
    var eventTypes = eventType.split(reSpliter),
        i = eventTypes.length;

    while (i--) {
        removeEvent(target, eventTypes[i], callback);
    }
};

eventListener.emit = function(target, eventType, event) {

    return dispatchEvent(target, eventType, isObject(event) ? event : {});
};

eventListener.getEventConstructor = function(target, eventType) {
    var getter = eventTable[eventType];
    return isFunction(getter) ? getter(target) : window.Event;
};


if (isFunction(document.addEventListener)) {

    listenToEvent = function(target, eventType, callback) {

        target.addEventListener(eventType, callback, false);
    };

    captureEvent = function(target, eventType, callback) {

        target.addEventListener(eventType, callback, true);
    };

    removeEvent = function(target, eventType, callback) {

        target.removeEventListener(eventType, callback, false);
    };

    dispatchEvent = function(target, eventType, event) {
        var getter = eventTable[eventType],
            EventType = isFunction(getter) ? getter(target) : window.Event;

        return !!target.dispatchEvent(new EventType(eventType, event));
    };
} else if (isFunction(document.attachEvent)) {

    listenToEvent = function(target, eventType, callback) {

        target.attachEvent("on" + eventType, callback);
    };

    captureEvent = function() {
        if (process.env.NODE_ENV === "development") {
            throw new Error(
                "Attempted to listen to events during the capture phase on a " +
                "browser that does not support the capture phase. Your application " +
                "will not receive some events."
            );
        }
    };

    removeEvent = function(target, eventType, callback) {

        target.detachEvent("on" + eventType, callback);
    };

    dispatchEvent = function(target, eventType, event) {
        var doc = target.ownerDocument || document;

        return !!target.fireEvent("on" + eventType, doc.createEventObject(event));
    };
} else {

    listenToEvent = function(target, eventType, callback) {

        target["on" + eventType] = callback;
        return target;
    };

    captureEvent = function() {
        if (process.env.NODE_ENV === "development") {
            throw new Error(
                "Attempted to listen to events during the capture phase on a " +
                "browser that does not support the capture phase. Your application " +
                "will not receive some events."
            );
        }
    };

    removeEvent = function(target, eventType) {

        target["on" + eventType] = null;
        return true;
    };

    dispatchEvent = function(target, eventType, event) {
        var onType = "on" + eventType;

        if (isFunction(target[onType])) {
            event.type = eventType;
            return !!target[onType](event);
        }

        return false;
    };
}


},
function(require, exports, module, global) {

// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};


},
function(require, exports, module, global) {

module.exports = function isObject(obj) {
    var type = typeof(obj);
    return type === "function" || (obj && type === "object") || false;
};


},
function(require, exports, module, global) {

var objectFunction = "[object Function]",
    toString = Object.prototype.toString,
    isFunction;


if (typeof(/./) === "function" || (typeof(Uint8Array) !== "undefined" && typeof(Uint8Array) !== "function")) {
    isFunction = function isFunction(obj) {
        return toString.call(obj) === objectFunction;
    };
} else {
    isFunction = function isFunction(obj) {
        return typeof(obj) === "function" || false;
    };
}


module.exports = isFunction;


},
function(require, exports, module, global) {

var isNode = require(7),
    environment = require(1);


var window = environment.window,

    XMLHttpRequest = window.XMLHttpRequest,
    OfflineAudioContext = window.OfflineAudioContext;


function returnEvent() {
    return window.Event;
}


module.exports = {
    abort: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else {
            return window.UIEvent || window.Event;
        }
    },

    afterprint: returnEvent,

    animationend: function() {
        return window.AnimationEvent || window.Event;
    },
    animationiteration: function() {
        return window.AnimationEvent || window.Event;
    },
    animationstart: function() {
        return window.AnimationEvent || window.Event;
    },

    audioprocess: function() {
        return window.AudioProcessingEvent || window.Event;
    },

    beforeprint: returnEvent,
    beforeunload: function() {
        return window.BeforeUnloadEvent || window.Event;
    },
    beginevent: function() {
        return window.TimeEvent || window.Event;
    },

    blocked: returnEvent,
    blur: function() {
        return window.FocusEvent || window.Event;
    },

    cached: returnEvent,
    canplay: returnEvent,
    canplaythrough: returnEvent,
    chargingchange: returnEvent,
    chargingtimechange: returnEvent,
    checking: returnEvent,

    click: function() {
        return window.MouseEvent || window.Event;
    },

    close: returnEvent,
    compassneedscalibration: function() {
        return window.SensorEvent || window.Event;
    },
    complete: function(target) {
        if (OfflineAudioContext && target instanceof OfflineAudioContext) {
            return window.OfflineAudioCompletionEvent || window.Event;
        } else {
            return window.Event;
        }
    },

    compositionend: function() {
        return window.CompositionEvent || window.Event;
    },
    compositionstart: function() {
        return window.CompositionEvent || window.Event;
    },
    compositionupdate: function() {
        return window.CompositionEvent || window.Event;
    },

    contextmenu: function() {
        return window.MouseEvent || window.Event;
    },
    copy: function() {
        return window.ClipboardEvent || window.Event;
    },
    cut: function() {
        return window.ClipboardEvent || window.Event;
    },

    dblclick: function() {
        return window.MouseEvent || window.Event;
    },
    devicelight: function() {
        return window.DeviceLightEvent || window.Event;
    },
    devicemotion: function() {
        return window.DeviceMotionEvent || window.Event;
    },
    deviceorientation: function() {
        return window.DeviceOrientationEvent || window.Event;
    },
    deviceproximity: function() {
        return window.DeviceProximityEvent || window.Event;
    },

    dischargingtimechange: returnEvent,

    DOMActivate: function() {
        return window.UIEvent || window.Event;
    },
    DOMAttributeNameChanged: function() {
        return window.MutationNameEvent || window.Event;
    },
    DOMAttrModified: function() {
        return window.MutationEvent || window.Event;
    },
    DOMCharacterDataModified: function() {
        return window.MutationEvent || window.Event;
    },
    DOMContentLoaded: returnEvent,
    DOMElementNameChanged: function() {
        return window.MutationNameEvent || window.Event;
    },
    DOMFocusIn: function() {
        return window.FocusEvent || window.Event;
    },
    DOMFocusOut: function() {
        return window.FocusEvent || window.Event;
    },
    DOMNodeInserted: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeInsertedIntoDocument: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeRemoved: function() {
        return window.MutationEvent || window.Event;
    },
    DOMNodeRemovedFromDocument: function() {
        return window.MutationEvent || window.Event;
    },
    DOMSubtreeModified: function() {
        return window.FocusEvent || window.Event;
    },
    downloading: returnEvent,

    drag: function() {
        return window.DragEvent || window.Event;
    },
    dragend: function() {
        return window.DragEvent || window.Event;
    },
    dragenter: function() {
        return window.DragEvent || window.Event;
    },
    dragleave: function() {
        return window.DragEvent || window.Event;
    },
    dragover: function() {
        return window.DragEvent || window.Event;
    },
    dragstart: function() {
        return window.DragEvent || window.Event;
    },
    drop: function() {
        return window.DragEvent || window.Event;
    },

    durationchange: returnEvent,
    ended: returnEvent,

    endEvent: function() {
        return window.TimeEvent || window.Event;
    },
    error: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else if (isNode(target)) {
            return window.UIEvent || window.Event;
        } else {
            return window.Event;
        }
    },
    focus: function() {
        return window.FocusEvent || window.Event;
    },
    focusin: function() {
        return window.FocusEvent || window.Event;
    },
    focusout: function() {
        return window.FocusEvent || window.Event;
    },

    fullscreenchange: returnEvent,
    fullscreenerror: returnEvent,

    gamepadconnected: function() {
        return window.GamepadEvent || window.Event;
    },
    gamepaddisconnected: function() {
        return window.GamepadEvent || window.Event;
    },

    hashchange: function() {
        return window.HashChangeEvent || window.Event;
    },

    input: returnEvent,
    invalid: returnEvent,

    keydown: function() {
        return window.KeyboardEvent || window.Event;
    },
    keyup: function() {
        return window.KeyboardEvent || window.Event;
    },
    keypress: function() {
        return window.KeyboardEvent || window.Event;
    },

    languagechange: returnEvent,
    levelchange: returnEvent,

    load: function(target) {
        if (XMLHttpRequest && target instanceof XMLHttpRequest) {
            return window.ProgressEvent || window.Event;
        } else {
            return window.UIEvent || window.Event;
        }
    },

    loadeddata: returnEvent,
    loadedmetadata: returnEvent,

    loadend: function() {
        return window.ProgressEvent || window.Event;
    },
    loadstart: function() {
        return window.ProgressEvent || window.Event;
    },

    message: function() {
        return window.MessageEvent || window.Event;
    },

    mousedown: function() {
        return window.MouseEvent || window.Event;
    },
    mouseenter: function() {
        return window.MouseEvent || window.Event;
    },
    mouseleave: function() {
        return window.MouseEvent || window.Event;
    },
    mousemove: function() {
        return window.MouseEvent || window.Event;
    },
    mouseout: function() {
        return window.MouseEvent || window.Event;
    },
    mouseover: function() {
        return window.MouseEvent || window.Event;
    },
    mouseup: function() {
        return window.MouseEvent || window.Event;
    },

    noupdate: returnEvent,
    obsolete: returnEvent,
    offline: returnEvent,
    online: returnEvent,
    open: returnEvent,
    orientationchange: returnEvent,

    pagehide: function() {
        return window.PageTransitionEvent || window.Event;
    },
    pageshow: function() {
        return window.PageTransitionEvent || window.Event;
    },

    paste: function() {
        return window.ClipboardEvent || window.Event;
    },
    pause: returnEvent,
    pointerlockchange: returnEvent,
    pointerlockerror: returnEvent,
    play: returnEvent,
    playing: returnEvent,

    popstate: function() {
        return window.PopStateEvent || window.Event;
    },
    progress: function() {
        return window.ProgressEvent || window.Event;
    },

    ratechange: returnEvent,
    readystatechange: returnEvent,

    repeatevent: function() {
        return window.TimeEvent || window.Event;
    },

    reset: returnEvent,

    resize: function() {
        return window.UIEvent || window.Event;
    },
    scroll: function() {
        return window.UIEvent || window.Event;
    },

    seeked: returnEvent,
    seeking: returnEvent,

    select: function() {
        return window.UIEvent || window.Event;
    },
    show: function() {
        return window.MouseEvent || window.Event;
    },
    stalled: returnEvent,
    storage: function() {
        return window.StorageEvent || window.Event;
    },
    submit: returnEvent,
    success: returnEvent,
    suspend: returnEvent,

    SVGAbort: function() {
        return window.SVGEvent || window.Event;
    },
    SVGError: function() {
        return window.SVGEvent || window.Event;
    },
    SVGLoad: function() {
        return window.SVGEvent || window.Event;
    },
    SVGResize: function() {
        return window.SVGEvent || window.Event;
    },
    SVGScroll: function() {
        return window.SVGEvent || window.Event;
    },
    SVGUnload: function() {
        return window.SVGEvent || window.Event;
    },
    SVGZoom: function() {
        return window.SVGEvent || window.Event;
    },
    timeout: function() {
        return window.ProgressEvent || window.Event;
    },

    timeupdate: returnEvent,

    touchcancel: function() {
        return window.TouchEvent || window.Event;
    },
    touchend: function() {
        return window.TouchEvent || window.Event;
    },
    touchenter: function() {
        return window.TouchEvent || window.Event;
    },
    touchleave: function() {
        return window.TouchEvent || window.Event;
    },
    touchmove: function() {
        return window.TouchEvent || window.Event;
    },
    touchstart: function() {
        return window.TouchEvent || window.Event;
    },

    transitionend: function() {
        return window.TransitionEvent || window.Event;
    },
    unload: function() {
        return window.UIEvent || window.Event;
    },

    updateready: returnEvent,
    upgradeneeded: returnEvent,

    userproximity: function() {
        return window.SensorEvent || window.Event;
    },

    visibilitychange: returnEvent,
    volumechange: returnEvent,
    waiting: returnEvent,

    wheel: function() {
        return window.WheelEvent || window.Event;
    }
};


},
function(require, exports, module, global) {

var isNode;


if (typeof(Node) !== "undefined") {
    isNode = function isNode(obj) {
        return obj instanceof Node;
    };
} else {
    isNode = function isNode(obj) {
        return (
            typeof(obj) === "object" &&
            typeof(obj.nodeType) === "number" &&
            typeof(obj.nodeName) === "string"
        );
    };
}


module.exports = isNode;


},
function(require, exports, module, global) {

var View = require(9),
    Component = require(22),
    render = require(28);


var virt = exports;


virt.render = render;

virt.Component = Component;

virt.View = View;
virt.createView = View.create;
virt.createFactory = View.createFactory;


},
function(require, exports, module, global) {

var isArray = require(10),
    isString = require(13),
    isNumber = require(14),
    isFunction = require(5),
    isObjectLike = require(12),
    fastSlice = require(15),
    map = require(16),
    has = require(18);


var ViewPrototype;


module.exports = View;


function View(type, key, ref, props, children) {
    this.__node = null;
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = props;
    this.children = children;
}

ViewPrototype = View.prototype;

ViewPrototype.__View__ = true;

function toJSON(view) {
    return {
        type: view.type,
        key: view.key,
        ref: view.ref,
        props: view.props,
        children: map(view.children, toJSON)
    };
}

ViewPrototype.toJSON = function() {
    return toJSON(this);
};

View.isView = isView;
View.isViewComponent = isViewComponent;
View.isPrimativeView = isPrimativeView;

View.create = function(type, config, children) {
    var isConfigArray = isArray(config),
        argumentsLength = arguments.length;

    if (isChild(config) || isConfigArray) {
        if (isConfigArray) {
            children = config;
        } else if (argumentsLength > 1) {
            children = fastSlice(arguments, 1);
        }
        config = null;
    } else {
        if (!isArray(children) && argumentsLength > 2) {
            children = fastSlice(arguments, 2);
        }
    }

    return construct(type, config, children);
};

View.createFactory = function(type) {
    return function factory(config, children) {
        var isConfigArray = isArray(config),
            argumentsLength = arguments.length;

        if (isChild(config) || isConfigArray) {
            if (isConfigArray) {
                children = config;
            } else if (argumentsLength > 0) {
                children = fastSlice(arguments);
            }
            config = null;
        } else {
            if (!isArray(children) && argumentsLength > 1) {
                children = fastSlice(arguments, 1);
            }
        }

        return construct(type, config, children);
    };
};

function construct(type, config, children) {
    var props = {},
        key = null,
        ref = null,
        configKey;

    if (config) {
        key = config.key != null ? config.key : null;
        ref = config.ref != null ? config.ref : null;

        for (configKey in config) {
            if (has(config, configKey)) {
                if (!(configKey === "key" || configKey === "ref")) {
                    props[configKey] = config[configKey];
                }
            }
        }
    }

    return new View(type, key, ref, props, insureValidChildren(children));
}

function isView(object) {
    return isObjectLike(object) && object.__View__ === true;
}

function isViewComponent(object) {
    return isView(object) && isFunction(object.type);
}

function isPrimativeView(object) {
    return isString(object) || isNumber(object);
}

function isChild(object) {
    return isView(object) || isPrimativeView(object);
}

function insureValidChildren(children) {
    var i, il, child;

    if (isArray(children)) {
        i = -1;
        il = children.length - 1;

        while (i++ < il) {
            child = children[i];

            if (isView(child)) {
                continue;
            } else if (isPrimativeView(child)) {
                children[i] = child;
            } else {
                throw new TypeError("child of a View must be a String, Number or a View");
            }
        }
    } else {
        children = [];
    }

    return children;
}


},
function(require, exports, module, global) {

var isLength = require(11),
    isObjectLike = require(12);


var objectArray = "[object Array]",
    toString = Object.prototype.toString;


module.exports = Array.isArray || function isArray(obj) {
    return isObjectLike(obj) && isLength(obj.length) && toString.call(obj) === objectArray;
};


},
function(require, exports, module, global) {

var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;


module.exports = function isLength(obj) {
    return typeof(obj) === "number" && obj > -1 && obj % 1 === 0 && obj <= MAX_SAFE_INTEGER;
};


},
function(require, exports, module, global) {

module.exports = function isObjectLike(obj) {
    return (obj && typeof(obj) === "object") || false;
};


},
function(require, exports, module, global) {

module.exports = function isString(obj) {
    return typeof(obj) === "string" || false;
};


},
function(require, exports, module, global) {

module.exports = function isNumber(obj) {
    return typeof(obj) === "number" || false;
};


},
function(require, exports, module, global) {

module.exports = function fastSlice(array, offset) {
    var length, i, il, result, j;

    offset = offset || 0;

    length = array.length;
    i = offset - 1;
    il = length - 1;
    result = new Array(length - offset);
    j = 0;

    while (i++ < il) {
        result[j++] = array[i];
    }

    return result;
};


},
function(require, exports, module, global) {

var keys = require(17),
    isNullOrUndefined = require(20),
    fastBindThis = require(21),
    isObjectLike = require(12),
    isLength = require(11);


function mapArray(array, callback) {
    var length = array.length,
        i = -1,
        il = length - 1,
        result = new Array(length);

    while (i++ < il) {
        result[i] = callback(array[i], i);
    }

    return result;
}

function mapObject(object, callback) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        result = {},
        key;

    while (i++ < il) {
        key = objectKeys[i];
        result[key] = callback(object[key], key);
    }

    return result;
}

module.exports = function map(object, callback, thisArg) {
    callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 2);
    return (isObjectLike(object) && isLength(object.length)) ? mapArray(object, callback) : mapObject(object, callback);
};


},
function(require, exports, module, global) {

var has = require(18),
    isNative = require(19),
    isObject = require(4);


var nativeKeys = Object.keys;


if (!isNative(nativeKeys)) {
    nativeKeys = function keys(obj) {
        var localHas = has,
            out = [],
            i = 0,
            key;

        for (key in obj) {
            if (localHas(obj, key)) {
                out[i++] = key;
            }
        }

        return out;
    };
}

module.exports = function keys(obj) {
    return nativeKeys(isObject(obj) ? obj : Object(obj));
};


},
function(require, exports, module, global) {

var hasOwnProp = Object.prototype.hasOwnProperty;


module.exports = function has(obj, key) {
    return hasOwnProp.call(obj, key);
};


},
function(require, exports, module, global) {

var isFunction = require(5);


var reHostCtor = /^\[object .+?Constructor\]$/,

    functionToString = Function.prototype.toString,

    reNative = RegExp("^" +
        functionToString.call(toString)
        .replace(/[.*+?^${}()|[\]\/\\]/g, "\\$&")
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    ),

    isHostObject = (function() {
        try {
            String({
                "toString": 0
            } + "");
        } catch (e) {
            return function isHostObject() {
                return false;
            };
        }

        return function isHostObject(value) {
            return !isFunction(value.toString) && typeof(value + "") === "string";
        };
    }());


module.exports = function isNative(obj) {
    return obj && (
        isFunction(obj) ?
        reNative.test(functionToString.call(obj)) : (
            typeof(obj) === "object" && (
                (isHostObject(obj) ? reNative : reHostCtor).test(obj) || false
            )
        )
    ) || false;
};


},
function(require, exports, module, global) {

module.exports = function isNullOrUndefined(obj) {
    return obj === null || obj === void 0;
};


},
function(require, exports, module, global) {

module.exports = function fastBindThis(callback, thisArg, length) {
    switch (length || callback.length) {
        case 0:
            return function bound() {
                return callback.call(thisArg);
            };
        case 1:
            return function bound(a1) {
                return callback.call(thisArg, a1);
            };
        case 2:
            return function bound(a1, a2) {
                return callback.call(thisArg, a1, a2);
            };
        case 3:
            return function bound(a1, a2, a3) {
                return callback.call(thisArg, a1, a2, a3);
            };
        case 4:
            return function bound(a1, a2, a3, a4) {
                return callback.call(thisArg, a1, a2, a3, a4);
            };
        default:
            return function bound() {
                return callback.apply(thisArg, arguments);
            };
    }
};


},
function(require, exports, module, global) {

var inherits = require(23),
    extend = require(25);


var ComponentPrototype;


module.exports = Component;


function Component(props, children) {
    this.__node = null;
    this.props = props;
    this.children = children;
    this.state = null;
}

ComponentPrototype = Component.prototype;

Component.extend = function(child, displayName) {
    inherits(child, this);
    if (displayName) {
        child.displayName = child.prototype.displayName = displayName;
    }
    return child;
};

ComponentPrototype.displayName = "Component";
ComponentPrototype.propTypes = {};
ComponentPrototype.contextTypes = {};

ComponentPrototype.setState = function(state) {
    this.state = extend({}, this.state, state);
};

ComponentPrototype.forceUpdate = function(state) {
    this.state = extend({}, this.state, state);
};

ComponentPrototype.render = function() {
    throw new Error("render() render must be defined on Components");
};

ComponentPrototype.componentDidMount = function() {};

ComponentPrototype.componentDidUpdate = function( /* previousProps, previousState */ ) {};

ComponentPrototype.componentWillMount = function() {};

ComponentPrototype.componentWillUnmount = function() {};

ComponentPrototype.componentWillReceiveProps = function( /* nextProps */ ) {};

ComponentPrototype.componentWillUpdate = function( /* nextProps, nextState */ ) {};

ComponentPrototype.shouldComponentUpdate = function( /* nextProps, nextState */ ) {
    return true;
};


},
function(require, exports, module, global) {

var create = require(24),
    extend = require(25),
    mixin = require(26),
    defineProperty = require(27);


function defineConstructorProperty(object, name, value) {
    defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
    });
}


module.exports = function inherits(child, parent) {

    mixin(child, parent);

    child.prototype = extend(create(parent.prototype), child.prototype);

    defineConstructorProperty(child, "__super", parent.prototype);
    defineConstructorProperty(child.prototype, "constructor", child);

    child.super_ = parent; // support node

    return child;
};


},
function(require, exports, module, global) {

module.exports = Object.create || (function() {
    function F() {}
    return function create(object) {
        F.prototype = object;
        return new F();
    };
}());


},
function(require, exports, module, global) {

var keys = require(17);


function baseExtend(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];
        a[key] = b[key];
    }
}

module.exports = function extend(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseExtend(out, arguments[i]);
    }

    return out;
};


},
function(require, exports, module, global) {

var keys = require(17),
    isNullOrUndefined = require(20);


function baseMixin(a, b) {
    var objectKeys = keys(b),
        i = -1,
        il = objectKeys.length - 1,
        key, value;

    while (i++ < il) {
        key = objectKeys[i];

        if (isNullOrUndefined(a[key]) && !isNullOrUndefined((value = b[key]))) {
            a[key] = value;
        }
    }
}

module.exports = function mixin(out) {
    var i = 0,
        il = arguments.length - 1;

    while (i++ < il) {
        baseMixin(out, arguments[i]);
    }

    return out;
};


},
function(require, exports, module, global) {

var isFunction = require(5),
    isObjectLike = require(12),
    isNative = require(19);


var defineProperty;


if (!isNative(Object.defineProperty)) {
    defineProperty = function defineProperty(object, name, value) {
        if (!isObjectLike(object)) {
            throw new TypeError("defineProperty called on non-object");
        }
        object[name] = isObjectLike(value) ? (isFunction(value.get) ? value.get : value.value) : value;
    };
} else {
    defineProperty = Object.defineProperty;
}

module.exports = defineProperty;


},
function(require, exports, module, global) {

var RootNode = require(29),
    createNode = require(30),
    shouldNodeUpdate = require(39),
    getRootIdFromId = require(40),
    createRootId = require(41);


var rootNodesById = global.rootNodesById = {};


module.exports = render;


function render(nextView, transaction, id) {
    var rootId = getRootIdFromId(id),
        rootNode = rootNodesById[rootId],
        previousNode;

    if (!rootNode) {
        id = rootId = createRootId();
        rootNode = new RootNode();
        rootNode.id = rootId;
        rootNodesById[rootId] = rootNode;
    }

    previousNode = rootNode.hash[id];

    if (previousNode) {
        if (shouldNodeUpdate(previousNode.currentView, nextView)) {
            previousNode.update(nextView, transaction);
            return;
        } else {
            previousNode.unmount(transaction);
        }
    } else {
        previousNode = createNode(nextView);
        previousNode.id = id;
        rootNode.add(previousNode);
    }

    previousNode.mount(nextView, transaction);
}


},
function(require, exports, module, global) {

var RootNodePrototype;


module.exports = RootNode;


function RootNode() {
    this.id = null;
    this.hash = {};
}

RootNodePrototype = RootNode.prototype;

RootNodePrototype.add = function(node) {
    this.hash[node.id] = node;
    node.root = this;
};

RootNodePrototype.remove = function(node) {
    var hash = this.hash,
        id = node.id;

    if (hash[id] !== undefined) {
        delete hash[id];
        node.root = null;
    }
};


},
function(require, exports, module, global) {

var isFunction = require(5),
    getComponentFromType = require(31),
    Node;


module.exports = createNode;


Node = require(32);


function createNode(view) {
    var node = new Node(),
        ComponentClass,
        instance;

    if (isFunction(view.type)) {
        ComponentClass = view.type;
    } else {
        ComponentClass = getComponentFromType(view.type);
    }

    instance = new ComponentClass(view.props, view.children);
    instance.__node = node;
    node.instance = instance;

    return node;
}




},
function(require, exports, module, global) {

var has = require(18),
    View = require(9),
    Component = require(22);


var cache = {};


module.exports = function getComponentFromType(type) {
    if (has(cache, type)) {
        return cache[type];
    } else {
        return (cache[type] = createComponentClassFromType(type));
    }
};

function createComponentClassFromType(type) {
    function NativeComponent(props, children) {
        Component.call(this, props, children);
    }
    Component.extend(NativeComponent);

    NativeComponent.prototype.render = function() {
        return new View(type, null, null, this.props, this.children);
    };

    return NativeComponent;
}


},
function(require, exports, module, global) {

var indexOf = require(33),
    forEach = require(34),
    map = require(16),
    diff = require(35),
    View = require(9),
    eachChildren = require(37),
    getViewKey = require(38),
    createNode = require(30);


var isPrimativeView = View.isPrimativeView,
    NodePrototype;


module.exports = Node;


function Node() {
    this.id = null;
    this.root = null;
    this.instance = null;
}

NodePrototype = Node.prototype;

NodePrototype.mount = function(view, transaction) {
    transaction.mount(this.id, this._renderViewAndChildren(view, transaction));
};

NodePrototype._mount = function(transaction) {
    var instance = this.instance;

    instance.componentWillMount();

    transaction.enqueueMount(function() {
        instance.componentDidMount();
    });
};

NodePrototype._renderViewAndChildren = function(view, transaction) {
    var root = this.root,
        parentId = this.id,
        renderedView = this.render();

    renderedView.key = view.key;
    renderedView.ref = view.ref;

    renderedView.children = map(renderedView.children, function(child, index) {
        var node;

        if (isPrimativeView(child)) {
            return child;
        } else {
            node = child.__node;

            if (!node) {
                node = child.__node = createNode(child);
                node.id = parentId + "." + getViewKey(child, index);
                root.add(node);
            }

            return node._renderViewAndChildren(child, transaction);
        }
    });

    this._mount(transaction);

    return renderedView;
};

NodePrototype.unmount = function(transaction) {
    this._unmount(transaction);
    transaction.unmount(this.id);
};

NodePrototype._unmount = function(transaction) {

    eachChildren(this.id, this.renderedView.children, function(child) {
        if (!isPrimativeView(child)) {
            child.__node._unmount();
        }
    });

    this.instance.componentWillUnmount();
    this.root.remove(this);
};

NodePrototype.update = function(nextView, transaction) {
    var patches = this._update(nextView);
    transaction.update(this.id, patches);
};

NodePrototype._update = function(nextView, transaction) {
    var instance = this.instance,
        nextProps = nextView.props,
        nextState = instance.state,
        previousView = this.currentView;

    if (instance.shouldComponentUpdate(nextProps, nextState)) {
        diff(previousView, nextView);

        nextView.__node = this;
        this.currentView = nextView;
    }
};

NodePrototype.render = function() {
    var renderedView = this.instance.render();

    renderedView.__node = this;
    this.renderedView = renderedView;

    return renderedView;
};


},
function(require, exports, module, global) {

var isLength = require(11),
    isObjectLike = require(12);


function arrayIndexOf(array, value, fromIndex) {
    var i = fromIndex - 1,
        il = array.length - 1;

    while (i++ < il) {
        if (array[i] === value) {
            return i;
        }
    }

    return -1;
}

module.exports = function indexOf(array, value, fromIndex) {
    return (isObjectLike(array) && isLength(array.length)) ? arrayIndexOf(array, value, fromIndex || 0) : -1;
};


},
function(require, exports, module, global) {

var keys = require(17),
    isNullOrUndefined = require(20),
    fastBindThis = require(21),
    isObjectLike = require(12),
    isLength = require(11);


function forEachArray(array, callback) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (callback(array[i], i) === false) {
            return false;
        }
    }

    return array;
}

function forEachObject(object, callback) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        key;

    while (i++ < il) {
        key = objectKeys[i];

        if (callback(object[key], key) === false) {
            return false;
        }
    }

    return object;
}

module.exports = function forEach(object, callback, thisArg) {
    callback = isNullOrUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 2);
    return (isObjectLike(object) && isLength(object.length)) ? forEachArray(object, callback) : forEachObject(object, callback);
};


},
function(require, exports, module, global) {

var isNullOrUndefined = require(20),
    getPrototypeOf = require(36),
    isObject = require(4),
    View = require(9);


var isView = View.isView,
    isPrimativeView = View.isPrimativeView;


module.exports = diff;


function diff(previous, next, transaction) {
    var propsDiff = diffProps(previous.props, next.props);

    if (propsDiff !== null) {
        console.log(previous.props, propsDiff);
    }

    return diffChildren(previous, next, transaction);
}

function diffProps(previous, next) {
    var result = null,
        key, previousValue, nextValue, propsDiff;

    for (key in previous) {
        nextValue = next[key];

        if (isNullOrUndefined(nextValue)) {
            result = result || {};
            result[key] = undefined;
        } else {
            previousValue = previous[key];

            if (previousValue === nextValue) {
                continue;
            } else if (isObject(previousValue) && isObject(nextValue)) {
                if (getPrototypeOf(previousValue) !== getPrototypeOf(nextValue)) {
                    result = result || {};
                    result[key] = nextValue;
                } else {
                    propsDiff = diffProps(previousValue, nextValue);
                    if (propsDiff !== null) {
                        result = result || {};
                        result[key] = propsDiff;
                    }
                }
            } else {
                result = result || {};
                result[key] = nextValue;
            }
        }
    }

    for (key in next) {
        if (isNullOrUndefined(previous[key])) {
            result = result || {};
            result[key] = next[key];
        }
    }

    return result;
}

function diffChildren(previous, next, transaction) {
    var previousChildren = previous.children,
        nextChildren = reorder(previousChildren, next.children),
        previousLength = previousChildren.length,
        nextLength = nextChildren.length,
        i = -1,
        il = (previousLength > nextLength ? previousLength : nextLength) - 1,
        previousChild, nextChild;

    while (i++ < il) {
        previousChild = previousChildren[i];
        nextChild = nextChildren[i];

        if (isNullOrUndefined(previousChild)) {
            if (!isNullOrUndefined(nextChild)) {
                console.log("insert");
            }
        } else {
            if (isPrimativeView(previousChild)) {
                if (isPrimativeView(nextChild)) {
                    if (previousChild !== nextChild) {
                        console.log("replace");
                    }
                } else {
                    console.log("replace with View");
                }
            } else {
                previousChild.__node.update(nextChild, transaction);
            }
        }
    }

    if (nextChildren.moves) {
        console.log("order");
    }
}

function reorder(previousChildren, nextChildren) {
    var previousKeys, nextKeys, previousMatch, nextMatch, key, previousLength, nextLength,
        length, shuffle, freeIndex, i, moveIndex, moves, removes, reverse, hasMoves, move, freeChild;

    nextKeys = keyIndex(nextChildren);
    if (nextKeys === null) {
        return nextChildren;
    }

    previousKeys = keyIndex(previousChildren);
    if (previousKeys === null) {
        return nextChildren;
    }

    nextMatch = {};
    previousMatch = {};

    for (key in nextKeys) {
        nextMatch[nextKeys[key]] = previousKeys[key];
    }

    for (key in previousKeys) {
        previousMatch[previousKeys[key]] = nextKeys[key];
    }

    previousLength = previousChildren.length;
    nextLength = nextChildren.length;
    length = previousLength > nextLength ? previousLength : nextLength;
    shuffle = [];
    freeIndex = 0;
    i = 0;
    moveIndex = 0;
    moves = {};
    removes = moves.removes = {};
    reverse = moves.reverse = {};
    hasMoves = false;

    while (freeIndex < length) {
        move = previousMatch[i];

        if (move !== undefined) {
            shuffle[i] = nextChildren[move];

            if (move !== moveIndex) {
                moves[move] = moveIndex;
                reverse[moveIndex] = move;
                hasMoves = true;
            }

            moveIndex++;
        } else if (i in previousMatch) {
            shuffle[i] = undefined;
            removes[i] = moveIndex++;
            hasMoves = true;
        } else {
            while (nextMatch[freeIndex] !== undefined) {
                freeIndex++;
            }

            if (freeIndex < length) {
                freeChild = nextChildren[freeIndex];

                if (freeChild) {
                    shuffle[i] = freeChild;
                    if (freeIndex !== moveIndex) {
                        hasMoves = true;
                        moves[freeIndex] = moveIndex;
                        reverse[moveIndex] = freeIndex;
                    }
                    moveIndex++;
                }
                freeIndex++;
            }
        }
        i++;
    }

    if (hasMoves) {
        shuffle.moves = moves;
    }

    return shuffle;
}

function keyIndex(children) {
    var i = -1,
        il = children.length - 1,
        keys = null,
        child;

    while (i++ < il) {
        child = children[i];

        if (child.key != null) {
            keys = keys || {};
            keys[child.key] = i;
        }
    }

    return keys;
}


},
function(require, exports, module, global) {

var isObject = require(4),
    isNative = require(19);


var nativeGetPrototypeOf = Object.getPrototypeOf;


if (!isNative(nativeGetPrototypeOf)) {
    nativeGetPrototypeOf = function getPrototypeOf(obj) {
        return obj.__proto__ || (
            obj.constructor ? obj.constructor.prototype : null
        );
    };
}

module.exports = function getPrototypeOf(obj) {
    return obj == null ? null : nativeGetPrototypeOf(
        (isObject(obj) ? obj : Object(obj))
    );
};


},
function(require, exports, module, global) {

var View = require(9),
    getViewKey = require(38);


var isPrimativeView = View.isPrimativeView;


module.exports = function eachChildren(parentId, children, fn) {
    var i = -1,
        il = children.length - 1,
        child, id;

    while (i++ < il) {
        child = children[i];

        if (!isPrimativeView(child)) {
            id = parentId + "." + getViewKey(child, i);

            if (fn(child, id, i) === false) {
                return false;
            } else {
                eachChildren(id, child.children, fn);
            }
        }
    }
    
    return true;
}


},
function(require, exports, module, global) {

var isNullOrUndefined = require(20);


var reEscape = /[=.:]/g;


function escapeKey(key) {
    return (key + "").replace(reEscape, "$");
}

function wrapKey(key) {
    return "$" + key;
}

module.exports = function getViewKey(view, index) {
    var key = view.key;

    if (isNullOrUndefined(key)) {
        return index.toString(36);
    } else {
        return wrapKey(escapeKey(key));
    }
}


},
function(require, exports, module, global) {

var isString = require(13),
    isNumber = require(14),
    isObjectLike = require(12),
    isNullOrUndefined = require(20);


module.exports = function shouldNodeUpdate(previous, next) {
    if (isNullOrUndefined(previous) || isNullOrUndefined(next)) {
        return false;
    } else {
        if (isString(previous) || isNumber(previous)) {
            return isString(next) || isNumber(next);
        } else {
            return (
                previous.type === next.type &&
                previous.key === next.key
            );
        }
    }
};


},
function(require, exports, module, global) {

module.exports = function getRootIdFromId(id) {
    var index;

    if (id && id.charAt(0) === "." && id.length > 1) {
        index = id.indexOf(".", 1);
        return index > -1 ? id.substr(0, index) : id;
    } else {
        return null;
    }
};


},
function(require, exports, module, global) {

var ROOT_ID = 0;


module.exports = function createRootId() {
    return "." + (ROOT_ID++).toString(36);
};


},
function(require, exports, module, global) {

var render = require(28),
    Transaction = require(43),
    getRootNodeInContainer = require(50),
    getNodeId = require(51);


module.exports = renderDOM;


function renderDOM(nextView, containerNode) {
    var rootNode, id;

    rootNode = getRootNodeInContainer(containerNode);
    id = getNodeId(rootNode);

    render(nextView, new Transaction(containerNode, rootNode), id);
}


},
function(require, exports, module, global) {

var Transaction = require(44),
    renderString = require(45),
    getNodeById = require(48);


var DOMTransactionPrototype;


module.exports = DOMTransaction;


function DOMTransaction(containerNode, rootNode) {

    Transaction.call(this);

    this.containerNode = containerNode;
    this.rootNode = rootNode || containerNode;
}
Transaction.extend(DOMTransaction);

DOMTransactionPrototype = DOMTransaction.prototype;


DOMTransactionPrototype.mount = function(id, view) {
    this.rootNode.innerHTML = renderString(view, id);
    this.onMount();
};

DOMTransactionPrototype.unmount = function(id) {
    var node = getNodeById(id);

    if (node === this.containerNode) {
        node.innerHTML = "";
    } else {
        node.parentNode.removeChild(node);
    }
};

DOMTransactionPrototype.update = function(id) {
    var domNode = getNodeById(id);
    console.log(domNode);
};


},
function(require, exports, module, global) {

var inherits = require(23);


var TransactionPrototype;


module.exports = Transaction;


function Transaction() {
    this.__mountQueue = [];
    this.__unmountQueue = [];
    this.__updateQueue = [];
}

Transaction.extend = function(child) {
    return inherits(child, this);
};

TransactionPrototype = Transaction.prototype;

TransactionPrototype.enqueueMount = function(fn) {
    var queue = this.__mountQueue;
    queue[queue.length] = fn;
};

TransactionPrototype.enqueueUnmount = function(fn) {
    var queue = this.__unmountQueue;
    queue[queue.length] = fn;
};

TransactionPrototype.enqueueUpdate = function(fn) {
    var queue = this.__updateQueue;
    queue[queue.length] = fn;
};

TransactionPrototype.onMount = function() {
    var queue = this.__mountQueue,
        i = -1,
        il = queue.length - 1;

    while (i++ < il) {
        queue[i]();
    }
    queue.length = 0;
};

TransactionPrototype.onUnmount = function() {
    var queue = this.__unmountQueue,
        i = -1,
        il = queue.length - 1;

    while (i++ < il) {
        queue[i]();
    }
    queue.length = 0;
};

TransactionPrototype.onUpdate = function() {
    var queue = this.__updateQueue,
        i = -1,
        il = queue.length - 1;

    while (i++ < il) {
        queue[i]();
    }
    queue.length = 0;
};

TransactionPrototype.mount = function(/* id, view */) {};
TransactionPrototype.unmount = function(/* id */) {};
TransactionPrototype.update = function(/* id, patches */) {};


},
function(require, exports, module, global) {

var map = require(16),
    virt = require(8),
    getViewKey = require(38),
    extend = require(25),
    isString = require(13),
    isObject = require(4),
    isNullOrUndefined = require(20),
    events = require(46),
    consts = require(47);


var DOM_ATTRIBUTE_NAME = consts.DOM_ATTRIBUTE_NAME,

    View = virt.View,
    isView = View.isView,
    getViewId = View.getViewId,

    closedTags = {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    };


module.exports = function render(view, id) {
    var type;

    if (!isView(view)) {
        return view + "";
    } else {
        type = view.type;

        return (
            closedTags[type] !== true ?
            contentTag(type, map(view.children, function(child, i) {
                return render(child, id +"."+ getViewKey(child, i));
            }).join(""), id, view.props) :
            closedTag(type, id, view.props)
        );
    }
};

function baseTagOptions(options) {
    var attributes = "",
        key, value;

    for (key in options) {
        if (!isNullOrUndefined(options[key]) && events[key] === undefined) {
            value = options[key];

            if (key === "className") {
                key = "class";
            }

            if (isObject(value)) {
                attributes += baseTagOptions(value);
            } else {
                attributes += key + '="' + value + '" ';
            }
        }
    }

    return attributes;
}

function tagOptions(options) {
    var attributes = baseTagOptions(options);
    return attributes !== "" ? " " + attributes : attributes;
}

function dataId(id) {
    return DOM_ATTRIBUTE_NAME + '="' + id +'"';
}

function closedTag(type, id, options) {
    return "<" + type + (isObject(options) ? tagOptions(options) : "") + dataId(id) + "/>";
}

function contentTag(type, content, id, options) {
    return (
        "<" + type + (isObject(options) ? tagOptions(options) : "") + dataId(id) + ">" +
        (isString(content) ? content : "") +
        "</" + type + ">"
    );
}


},
function(require, exports, module, global) {

module.exports = {
    // Clipboard Events
    onCopy: "copy",
    onCut: "cut",
    onPaste: "paste",

    // Keyboard Events
    onKeydown: "keydown",
    onKeyup: "keyup",
    onKeypress: "keypress",

    // Focus Events
    onFocus: "focus",
    onBlur: "blur",

    // Form Events
    onChange: "change",
    onInput: "input",
    onSubmit: "submit",

    // Mouse Events
    onClick: "click",
    onDoubleClick: "doubleclick",
    onMouseDown: "mousedown",
    onMouseEnter: "mouseenter",
    onMouseLeave: "mouseleave",
    onMouseMove: "mousemove",
    onMouseOut: "mouseout",
    onMouseOver: "mouseover",
    onMouseUp: "mouseup",

    // Drag Events
    onDrag: "drag",
    onDragEnd: "dragend",
    onDragEnter: "dragenter",
    onDragExit: "dragexit",
    onDragLeave: "dragleave",
    onDragOver: "dragover",
    onDragStart: "dragstart",
    onDragDrop: "dragdrop",

    // Touch Events
    onTouchCancel: "touchcancel",
    onTouchEnd: "touchend",
    onTouchMove: "touchmove",
    onTouchStart: "touchstart",

    // Scroll Event
    onScroll: "scroll",

    // Wheel Event
    onWheel: "wheel"
};


},
function(require, exports, module, global) {

module.exports = {
    DOM_ATTRIBUTE_NAME: "data-virtid"
};


},
function(require, exports, module, global) {

var nodeCache = require(49);


module.exports = function getNodeById(id) {
    return nodeCache[id];
};


},
function(require, exports, module, global) {




},
function(require, exports, module, global) {

module.exports = function getRootNodeInContainer(containerNode) {
    if (!containerNode) {
        return null;
    } else {
        if (containerNode.nodeType === 9) {
            return containerNode.documentElement;
        } else {
            return containerNode.firstChild;
        }
    }
};


},
function(require, exports, module, global) {

var has = require(18),
    nodeCache = require(49),
    consts = require(47);


var DOM_ATTRIBUTE_NAME = consts.DOM_ATTRIBUTE_NAME;


module.exports = function getNodeId(node) {
    return node && getId(node);
};

function getId(node) {
    var id = getNodeAttributeId(node),
        cached;

    if (id) {
        if (has(nodeCache, id)) {
            cached = nodeCache[id];

            if (cached !== node) {
                nodeCache[id] = node;
            }
        } else {
            nodeCache[id] = node;
        }
    }

    return id;
}

function getNodeAttributeId(node) {
    return node && node.getAttribute && node.getAttribute(DOM_ATTRIBUTE_NAME) || "";
}


},
function(require, exports, module, global) {

var virt = require(8),
    TodoList = require(53);


module.exports = App;


function App(props, children) {
    virt.Component.call(this, props, children);
}
virt.Component.extend(App, "App");

App.prototype.render = function() {
    return (
        virt.createView("div", {
                className: "app"
            },
            virt.createView(TodoList)
        )
    );
};


},
function(require, exports, module, global) {

var virt = require(8),
    map = require(16),
    dispatcher = require(54),
    TodoStore = require(56),
    TodoItem = require(58);


var TodoListPrototype;


dispatcher.handleViewAction({
    actionType: TodoStore.consts.TODO_CREATE,
    text: "todo item 1"
});


module.exports = TodoList;


function TodoList(props, children) {
    var _this = this;

    virt.Component.call(this, props, children);

    this.state = {
        list: []
    };

    this.onChange = function() {
        _this.__onChange();
    };
}
virt.Component.extend(TodoList, "TodoList");

TodoListPrototype = TodoList.prototype;

TodoListPrototype.__onChange = function() {
    var _this = this;

    TodoStore.all(function(err, todos) {
        console.log(_this);
        _this.setState({
            list: todos
        });
    });
};

TodoListPrototype.componentDidMount = function() {
    TodoStore.addChangeListener(this.onChange);
    this.onChange();
};

TodoListPrototype.componentWillUnmount = function() {
    TodoStore.removeChangeListener(this.onChange);
};

TodoListPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-list"
            },
            map(this.state.list, function(item) {
                return virt.createView(TodoItem, {
                    key: item.id,
                    id: item.id,
                    text: item.text
                });
            })
        )
    );
};


},
function(require, exports, module, global) {

var EventEmitter = require(55);


var dispatcher = module.exports = new EventEmitter(-1),
    DISPATCH = "DISPATCH",
    VIEW_ACTION = "VIEW_ACTION";


dispatcher.register = function(callback) {
    dispatcher.on(DISPATCH, callback);
    return callback;
};

dispatcher.handleViewAction = function(action) {
    dispatcher.emit(DISPATCH, {
        type: VIEW_ACTION,
        action: action
    });
};


},
function(require, exports, module, global) {

var isFunction = require(5),
    inherits = require(23),
    fastSlice = require(15),
    defineProperty = require(27),
    keys = require(17);


function EventEmitter(maxListeners) {
    this.__events = {};
    this.__maxListeners = maxListeners != null ? maxListeners : EventEmitter.defaultMaxListeners;
}

EventEmitter.prototype.on = function(name, listener) {
    var events, eventList, maxListeners;

    if (!isFunction(listener)) {
        throw new TypeError("EventEmitter.on(name, listener) listener must be a function");
    }

    events = this.__events || (this.__events = {});
    eventList = (events[name] || (events[name] = []));
    maxListeners = this.__maxListeners || -1;

    eventList[eventList.length] = listener;

    if (maxListeners !== -1 && eventList.length > maxListeners) {
        console.error(
            "EventEmitter.on(type, listener) possible EventEmitter memory leak detected. " + maxListeners + " listeners added"
        );
    }

    return this;
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

EventEmitter.prototype.once = function(name, listener) {
    var _this = this;

    function once() {
        var length = arguments.length;

        _this.off(name, once);

        if (length === 0) {
            return listener();
        } else if (length === 1) {
            return listener(arguments[0]);
        } else if (length === 2) {
            return listener(arguments[0], arguments[1]);
        } else if (length === 3) {
            return listener(arguments[0], arguments[1], arguments[2]);
        } else if (length === 4) {
            return listener(arguments[0], arguments[1], arguments[2], arguments[3]);
        } else {
            return listener.apply(null, arguments);
        }
    }

    this.on(name, once);

    return once;
};

EventEmitter.prototype.listenTo = function(obj, name) {
    var _this = this;

    if (!obj || !(isFunction(obj.on) || isFunction(obj.addListener))) {
        throw new TypeError("EventEmitter.listenTo(obj, name) obj must have a on function taking (name, listener[, ctx])");
    }

    function handler() {
        _this.emitArgs(name, arguments);
    }

    obj.on(name, handler);

    return handler;
};

EventEmitter.prototype.off = function(name, listener) {
    var events = this.__events || (this.__events = {}),
        eventList, event, i;

    eventList = events[name];
    if (!eventList) {
        return this;
    }

    if (!listener) {
        i = eventList.length;

        while (i--) {
            this.emit("removeListener", name, eventList[i]);
        }
        eventList.length = 0;
        delete events[name];
    } else {
        i = eventList.length;

        while (i--) {
            event = eventList[i];

            if (event === listener) {
                this.emit("removeListener", name, event);
                eventList.splice(i, 1);
            }
        }

        if (eventList.length === 0) {
            delete events[name];
        }
    }

    return this;
};

EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

EventEmitter.prototype.removeAllListeners = function() {
    var events = this.__events || (this.__events = {}),
        objectKeys = keys(events),
        i = -1,
        il = objectKeys.length - 1,
        key, eventList, j;

    while (i++ < il) {
        key = objectKeys[i];
        eventList = events[key];

        if (eventList) {
            j = eventList.length;

            while (j--) {
                this.emit("removeListener", key, eventList[j]);
                eventList.splice(j, 1);
            }
        }

        delete events[key];
    }

    return this;
};

function emit(eventList, args) {
    var a1, a2, a3, a4,
        length = eventList.length - 1,
        i = -1,
        event;

    switch (args.length) {
        case 0:
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event();
                }
            }
            break;
        case 1:
            a1 = args[0];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1);
                }
            }
            break;
        case 2:
            a1 = args[0];
            a2 = args[1];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2);
                }
            }
            break;
        case 3:
            a1 = args[0];
            a2 = args[1];
            a3 = args[2];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2, a3);
                }
            }
            break;
        case 4:
            a1 = args[0];
            a2 = args[1];
            a3 = args[2];
            a4 = args[3];
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event(a1, a2, a3, a4);
                }
            }
            break;
        default:
            while (i++ < length) {
                if ((event = eventList[i])) {
                    event.apply(null, args);
                }
            }
            break;
    }
}

EventEmitter.prototype.emitArgs = function(name, args) {
    var eventList = (this.__events || (this.__events = {}))[name];

    if (!eventList || !eventList.length) {
        return this;
    }

    emit(eventList, args);

    return this;
};

EventEmitter.prototype.emit = function(name) {
    return this.emitArgs(name, fastSlice(arguments, 1));
};

function emitAsync(eventList, args, callback) {
    var length = eventList.length,
        index = 0,
        called = false;

    function next(err) {
        if (called !== true) {
            if (err || index === length) {
                called = true;
                callback(err);
            } else {
                eventList[index++].apply(null, args);
            }
        }
    }

    args[args.length] = next;
    next();
}

EventEmitter.prototype.emitAsync = function(name, args, callback) {
    var eventList = (this.__events || (this.__events = {}))[name];

    args = fastSlice(arguments, 1);
    callback = args.pop();

    if (!isFunction(callback)) {
        throw new TypeError("EventEmitter.emitAsync(name [, ...args], callback) callback must be a function");
    }

    if (!eventList || !eventList.length) {
        callback();
    } else {
        emitAsync(eventList, args, callback);
    }

    return this;
};

EventEmitter.prototype.listeners = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];

    return eventList ? eventList.slice() : [];
};

EventEmitter.prototype.listenerCount = function(name) {
    var eventList = (this.__events || (this.__events = {}))[name];

    return eventList ? eventList.length : 0;
};

EventEmitter.prototype.setMaxListeners = function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    this.__maxListeners = value < 0 ? -1 : value;
    return this;
};


defineConstructorProperty(EventEmitter, "defaultMaxListeners", 10);


defineConstructorProperty(EventEmitter, "listeners", function(obj, name) {
    var eventList;

    if (obj == null) {
        throw new TypeError("EventEmitter.listeners(obj, name) obj required");
    }
    eventList = obj.__events && obj.__events[name];

    return eventList ? eventList.slice() : [];
});

defineConstructorProperty(EventEmitter, "listenerCount", function(obj, name) {
    var eventList;

    if (obj == null) {
        throw new TypeError("EventEmitter.listenerCount(obj, name) obj required");
    }
    eventList = obj.__events && obj.__events[name];

    return eventList ? eventList.length : 0;
});

defineConstructorProperty(EventEmitter, "setMaxListeners", function(value) {
    if ((value = +value) !== value) {
        throw new TypeError("EventEmitter.setMaxListeners(value) value must be a number");
    }

    EventEmitter.defaultMaxListeners = value < 0 ? -1 : value;
    return value;
});

EventEmitter.extend = function(child) {
    inherits(child, this);
    return child;
};


function defineConstructorProperty(object, name, value) {
    defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: value
    });
}


module.exports = EventEmitter;


},
function(require, exports, module, global) {

var EventEmitter = require(55),
    values = require(57),
    dispatcher = require(54);


var TodoStore = module.exports = new EventEmitter(-1),
    CHANGE = "CHANGE";


TodoStore.consts = {
    TODO_CREATE: "TODO_CREATE",
    TODO_UPDATE: "TODO_UPDATE",
    TODO_DELETE: "TODO_DELETE"
};


var _todoId = 1,
    _todos = {};


function create(text, callback) {
    setTimeout(function() {
        var id = _todoId++,
            todo = _todos[id] = {
                id: id,
                text: text
            };

        callback(undefined, todo);
    }, Math.random() * 100);
}

function update(id, text, callback) {
    setTimeout(function() {
        var todo = _todos[id];

        todo.text = text;

        callback(undefined, todo);
    }, Math.random() * 100);
}

function destroy(id, callback) {
    setTimeout(function() {
        var todo = _todos[id];

        delete _todos[id];

        callback(undefined, todo);
    }, Math.random() * 100);
}

TodoStore.all = function(callback) {
    setTimeout(function() {
        callback(undefined, values(_todos));
    }, Math.random() * 100);
};

TodoStore.show = function(id, callback) {
    setTimeout(function() {
        callback(undefined, _todos[id]);
    }, Math.random() * 100);
};

TodoStore.addChangeListener = function(callback) {
    TodoStore.on(CHANGE, callback);
};

TodoStore.removeChangeListener = function(callback) {
    TodoStore.off(CHANGE, callback);
};

TodoStore.emitChange = function() {
    TodoStore.emit(CHANGE);
};

TodoStore.id = dispatcher.register(function(payload) {
    var action = payload.action;

    switch (action.actionType) {
        case TodoStore.consts.TODO_CREATE:
            create(action.text, function() {
                TodoStore.emitChange();
            });
            break;
        case TodoStore.consts.TODO_UPDATE:
            update(action.id, action.text, function() {
                TodoStore.emitChange();
            });
            break;
        case TodoStore.consts.TODO_DELETE:
            destroy(action.id, function() {
                TodoStore.emitChange();
            });
            break;
    }
});


},
function(require, exports, module, global) {

var keys = require(17);


function objectValues(object, objectKeys) {
    var length = objectKeys.length,
        results = new Array(length),
        i = -1,
        il = length - 1;

    while (i++ < il) {
        results[i] = object[objectKeys[i]];
    }

    return results;
}


function values(object) {
    return objectValues(object, keys(object));
}

values.objectValues = objectValues;


module.exports = values;


},
function(require, exports, module, global) {

var virt = require(8),
    propTypes = require(59);


var TodoItemPrototype;


module.exports = TodoItem;


function TodoItem(props, children) {
    virt.Component.call(this, props, children);
}
virt.Component.extend(TodoItem, "TodoItem");

TodoItemPrototype = TodoItem.prototype;

TodoItem.propTypes = {
    id: propTypes.number.isRequired,
    text: propTypes.string.isRequired
};

TodoItemPrototype.render = function() {
    return (
        virt.createView("div", {
                id: this.props.id,
                className: "todo-item"
            },
            virt.createView("p", this.props.text)
        )
    );
};


},
function(require, exports, module, global) {

var isArray = require(10),
    isRegExp = require(60),
    isNullOrUndefined = require(20),
    emptyFunction = require(61),
    isFunction = require(5),
    has = require(18),
    indexOf = require(33);


var propTypes = exports,
    ANONYMOUS_CALLER = "<<anonymous>>";


propTypes.array = createPrimitiveTypeChecker("array");
propTypes.bool = createPrimitiveTypeChecker("boolean");
propTypes.func = createPrimitiveTypeChecker("function");
propTypes.number = createPrimitiveTypeChecker("number");
propTypes.object = createPrimitiveTypeChecker("object");
propTypes.string = createPrimitiveTypeChecker("string");

propTypes.regexp = createTypeChecker(function validate(props, propName, callerName) {
    var propValue = props[propName];

    if (isRegExp(propValue)) {
        return null;
    } else {
        return new TypeError(
            "Invalid " + propName + " of value " + propValue + " supplied to " + callerName + ", " +
            "expected RexExp."
        );
    }
});

propTypes.instanceOf = function createInstanceOfCheck(expectedClass) {
    return createTypeChecker(function validate(props, propName, callerName) {
        var propValue = props[propName],
            expectedClassName;

        if (propValue instanceof expectedClass) {
            return null;
        } else {
            expectedClassName = expectedClass.name || ANONYMOUS_CALLER;

            return new TypeError(
                "Invalid " + propName + " of type " + getPreciseType(propValue) + " supplied to " + callerName + ", " +
                "expected instance of " + expectedClassName + "."
            );
        }
    });
};

propTypes.any = createTypeChecker(emptyFunction.thatReturnsNull);

propTypes.oneOf = function createOneOfCheck(expectedValues) {
    return createTypeChecker(function validate(props, propName, callerName) {
        var propValue = props[propName];

        if (indexOf(expectedValues, propValue) !== -1) {
            return null;
        } else {
            return new TypeError(
                "Invalid " + propName + " of value " + propValue + " supplied to " + callerName + ", " +
                "expected one of " + JSON.stringify(expectedValues) + "."
            );
        }
    });
};

propTypes.implement = function createImplementCheck(expectedInterface) {
    var key;

    for (key in expectedInterface) {
        if (has(expectedInterface, key) && !isFunction(expectedInterface[key])) {
            throw new TypeError(
                "Invalid Interface value " + key + ", must be functions " +
                "(props : Object, propName : String[, callerName : String]) return Error or null."
            );
        }
    }

    return createTypeChecker(function validate(props, propName, callerName) {
        var results = null,
            propInterface = props[propName],
            propKey, propValidate, result;

        for (propKey in propInterface) {
            if (has(propInterface, propKey)) {
                propValidate = expectedInterface[propKey];
                result = propValidate(propInterface, propKey, callerName + "." + propKey);

                if (result) {
                    results = results || [];
                    results[results.length] = result;
                }
            }
        }

        return results;
    });
};


propTypes.createTypeChecker = createTypeChecker;


function createTypeChecker(validate) {

    function checkType(props, propName, callerName) {
        if (isNullOrUndefined(props[propName])) {
            return null;
        } else {
            return validate(props, propName, callerName || ANONYMOUS_CALLER);
        }
    }

    checkType.isRequired = function checkIsRequired(props, propName, callerName) {
        callerName = callerName || ANONYMOUS_CALLER;

        if (isNullOrUndefined(props[propName])) {
            return new TypeError(
                "Required " + propName + " was not specified in " + callerName + "."
            );
        } else {
            return validate(props, propName, callerName);
        }
    };

    return checkType;
}

function createPrimitiveTypeChecker(expectedType) {
    return createTypeChecker(function validate(props, propName, callerName) {
        var propValue = props[propName],
            type = getPropType(propValue);

        if (type !== expectedType) {
            callerName = callerName || ANONYMOUS_CALLER;

            return new TypeError(
                "Invalid " + propName + " of type " + getPreciseType(propValue) + " " +
                "supplied to " + callerName + " expected " + expectedType + "."
            );
        } else {
            return null;
        }
    });
}

function getPropType(value) {
    var propType = typeof(value);

    if (isArray(value)) {
        return "array";
    } else if (value instanceof RegExp) {
        return "object";
    } else {
        return propType;
    }
}

function getPreciseType(propValue) {
    var propType = getPropType(propValue);

    if (propType === "object") {
        if (propValue instanceof Date) {
            return "date";
        } else if (propValue instanceof RegExp) {
            return "regexp";
        } else {
            return propType;
        }
    } else {
        return propType;
    }
}


},
function(require, exports, module, global) {

var isObjectLike = require(12);


var objectRegExpStr = "[object RegExp]",
    objectToString = Object.prototype.toString;


module.exports = function isRegExp(obj) {
    return (isObjectLike(obj) && objectToString.call(obj) === objectRegExpStr) || false;
};


},
function(require, exports, module, global) {

module.exports = emptyFunction;


function emptyFunction() {}

function makeEmptyFunction(value) {
    return function() {
        return value;
    };
}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() {
    return this;
};
emptyFunction.thatReturnsArgument = function(argument) {
    return argument;
};


}], (new Function("return this;"))()));
