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
    virtDOM = require(51),
    App = require(69);


eventListener.on(environment.window, "load", function() {
    virtDOM(virt.createView(App), document.getElementById("app"));
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

var View = require(9);


var virt = exports;


virt.Root = require(24);

virt.Component = require(42);

virt.View = View;
virt.createView = View.create;
virt.createFactory = View.createFactory;


},
function(require, exports, module, global) {

var isPrimitive = require(10),
    isFunction = require(5),
    isArray = require(12),
    isString = require(15),
    isObjectLike = require(14),
    isNumber = require(16),
    fastSlice = require(17),
    has = require(18),
    map = require(19);


var ViewPrototype;


module.exports = View;


function View(type, key, ref, props, children) {
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.props = props;
    this.children = children;
}

ViewPrototype = View.prototype;

ViewPrototype.__View__ = true;

ViewPrototype.toJSON = function() {
    return toJSON(this);
};

View.isView = isView;
View.isPrimativeView = isPrimativeView;
View.isViewComponent = isViewComponent;
View.isViewJSON = isViewJSON;

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

function propsToJSON(props) {
    var out = {},
        key, value;

    for (key in props) {
        if (!isFunction((value = props[key]))) {
            out[key] = value;
        }
    }

    return out;
}

function toJSON(view) {
    if (isPrimitive(view)) {
        return view;
    } else {
        return {
            type: view.type,
            key: view.key,
            ref: view.ref,
            props: propsToJSON(view.props),
            children: map(view.children, toJSON)
        };
    }
}

function isView(obj) {
    return isObjectLike(obj) && obj.__View__ === true;
}

function isViewComponent(obj) {
    return isView(obj) && isFunction(obj.type);
}

function isViewJSON(obj) {
    return (
        isObjectLike(obj) &&
        isString(obj.type) &&
        isObjectLike(obj.props) &&
        isArray(obj.children)
    );
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

var isNullOrUndefined = require(11);


module.exports = function isPrimitive(obj) {
    var typeStr;
    return isNullOrUndefined(obj) || ((typeStr = typeof(obj)) !== "object" && typeStr !== "function") || false;
};


},
function(require, exports, module, global) {

module.exports = function isNullOrUndefined(obj) {
    return obj === null || obj === void 0;
};


},
function(require, exports, module, global) {

var isLength = require(13),
    isObjectLike = require(14);


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

var hasOwnProp = Object.prototype.hasOwnProperty;


module.exports = function has(obj, key) {
    return hasOwnProp.call(obj, key);
};


},
function(require, exports, module, global) {

var keys = require(20),
    isNullOrUndefined = require(11),
    fastBindThis = require(22),
    isArrayLike = require(23);


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
    return isArrayLike(object) ? mapArray(object, callback) : mapObject(object, callback);
};


},
function(require, exports, module, global) {

var has = require(18),
    isNative = require(21),
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

var isLength = require(13),
    isObjectLike = require(14);


module.exports = function isArrayLike(obj) {
    return isObjectLike(obj) && isLength(obj.length);
};


},
function(require, exports, module, global) {

var Transaction = require(25),
    shouldUpdate = require(37),
    EventManager = require(38),
    Node = require(39);


var RootPrototype,
    ROOT_ID = 0;


module.exports = Root;


function Root() {

    this.id = "." + (ROOT_ID++).toString(36);
    this.childHash = {};

    this.eventManager = new EventManager();

    this.adaptor = null;

    this.__transactions = [];
    this.__currentTransaction = null;
}

RootPrototype = Root.prototype;

RootPrototype.appendNode = function(node) {
    var id = node.id,
        childHash = this.childHash;

    if (childHash[id] === undefined) {
        node.root = this;
        childHash[id] = node;
    } else {
        throw new Error("Root appendNode(node) trying to override node at " + id);
    }
};

RootPrototype.removeNode = function(node) {
    var id = node.id,
        childHash = this.childHash;

    if (childHash[id] !== undefined) {
        node.parent = null;
        delete childHash[id];
    } else {
        throw new Error("Root removeNode(node) trying to remove node that does not exists with id " + id);
    }
};

RootPrototype.__processTransaction = function() {
    var _this = this,
        transactions = this.__transactions,
        transaction;

    if (this.__currentTransaction === null && transactions.length !== 0) {
        this.__currentTransaction = transaction = transactions[0];

        this.adaptor.handle(transaction, function() {
            transactions.splice(0, 1);

            transaction.queue.notifyAll();
            transaction.destroy();

            _this.__currentTransaction = null;

            if (transactions.length !== 0) {
                _this.__processTransaction();
            }
        });
    }
};

RootPrototype.__enqueueTransaction = function(transaction) {
    var transactions = this.__transactions;
    transactions[transactions.length] = transaction;
};

RootPrototype.update = function(node) {
    var transaction = Transaction.create(),
        component = node.component,
        renderedView = node.renderedView,
        currentView = node.currentView;

    node.__update(
        component.props, renderedView.props,
        component.children, renderedView.children,
        component.__previousState, component.state,
        currentView,
        transaction
    );

    this.__enqueueTransaction(transaction);
    this.__processTransaction();
};

RootPrototype.render = function(nextView, id) {
    var transaction = Transaction.create(),
        node;

    id = id || this.id;
    node = this.childHash[id];

    if (node) {
        if (shouldUpdate(node.renderedView, nextView)) {

            node.update(nextView, transaction);
            this.__enqueueTransaction(transaction);
            this.__processTransaction();

            return;
        } else {
            node.unmount(transaction);
        }
    }

    node = Node.create(nextView);
    node.id = id;
    this.appendNode(node);
    node.mount(transaction);

    this.__enqueueTransaction(transaction);
    this.__processTransaction();
};


},
function(require, exports, module, global) {

var createPool = require(26),
    Queue = require(28),
    consts = require(29),
    InsertPatch = require(31),
    OrderPatch = require(32),
    PropsPatch = require(33),
    RemovePatch = require(34),
    ReplacePatch = require(35),
    TextPatch = require(36);


module.exports = Transaction;


function Transaction() {

    this.queue = Queue.getPooled();

    this.removes = {};
    this.patches = {};

    this.events = {};
    this.eventsRemove = {};
}
createPool(Transaction);
Transaction.consts = consts;

Transaction.create = function() {
    return Transaction.getPooled();
};

Transaction.prototype.destroy = function() {
    Transaction.release(this);
};

function clearPatches(hash) {
    var id, array, j, jl;

    for (id in hash) {
        if ((array = hash[id]) !== undefined) {
            j = -1;
            jl = array.length - 1;

            while (j++ < jl) {
                array[j].destroy();
            }

            delete hash[id];
        }
    }
}

function clearHash(hash) {
    for (var id in hash) {
        if (hash[id] !== undefined) {
            delete hash[id];
        }
    }
}

Transaction.prototype.destructor = function() {
    clearPatches(this.patches);
    clearPatches(this.removes);
    clearHash(this.events);
    clearHash(this.eventsRemove);
    return this;
};

Transaction.prototype.insert = function(id, childId, index, next) {
    this.append(InsertPatch.create(id, childId, index, next));
};

Transaction.prototype.order = function(id, order) {
    this.append(OrderPatch.create(id, order));
};

Transaction.prototype.props = function(id, previous, props) {
    this.append(PropsPatch.create(id, previous, props));
};

Transaction.prototype.replace = function(id, childId, index, next) {
    this.append(ReplacePatch.create(id, childId, index, next));
};

Transaction.prototype.text = function(id, index, next) {
    this.append(TextPatch.create(id, index, next));
};

Transaction.prototype.remove = function(id, childId, index) {
    this.appendRemove(RemovePatch.create(id, childId, index));
};

Transaction.prototype.event = function(id, type) {
    this.events[id] = type;
};

Transaction.prototype.removeEvent = function(id, type) {
    this.eventsRemove[id] = type;
};

function append(hash, value) {
    var id = value.id,
        patchArray = hash[id] || (hash[id] = []);

    patchArray[patchArray.length] = value;
}

Transaction.prototype.append = function(value) {
    append(this.patches, value);
};

Transaction.prototype.appendRemove = function(value) {
    append(this.removes, value);
};

Transaction.prototype.toJSON = function() {
    return {
        removes: this.removes,
        patches: this.patches,

        events: this.events,
        eventsRemove: this.eventsRemove
    };
};


},
function(require, exports, module, global) {

var isFunction = require(5),
    isNumber = require(16),
    defineProperty = require(27);


var descriptor = {
    configurable: false,
    enumerable: false,
    writable: false,
    value: null
};

function addProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function createPooler(Constructor) {
    switch (Constructor.length) {
        case 0:
            return createNoArgumentPooler(Constructor);
        case 1:
            return createOneArgumentPooler(Constructor);
        case 2:
            return createTwoArgumentsPooler(Constructor);
        case 3:
            return createThreeArgumentsPooler(Constructor);
        case 4:
            return createFourArgumentsPooler(Constructor);
        case 5:
            return createFiveArgumentsPooler(Constructor);
        default:
            return createApplyPooler(Constructor);
    }
}

function createNoArgumentPooler(Constructor) {
    return function pooler() {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            return instance;
        } else {
            return new Constructor();
        }
    };
}

function createOneArgumentPooler(Constructor) {
    return function pooler(a0) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0);
            return instance;
        } else {
            return new Constructor(a0);
        }
    };
}

function createTwoArgumentsPooler(Constructor) {
    return function pooler(a0, a1) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1);
            return instance;
        } else {
            return new Constructor(a0, a1);
        }
    };
}

function createThreeArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2);
            return instance;
        } else {
            return new Constructor(a0, a1, a2);
        }
    };
}

function createFourArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2, a3) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2, a3);
            return instance;
        } else {
            return new Constructor(a0, a1, a2, a3);
        }
    };
}

function createFiveArgumentsPooler(Constructor) {
    return function pooler(a0, a1, a2, a3, a4) {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.call(instance, a0, a1, a2, a3, a4);
            return instance;
        } else {
            return new Constructor(a0, a1, a2, a3, a4);
        }
    };
}

function createApplyConstructor(Constructor) {
    function F(args) {
        return Constructor.apply(this, args);
    }
    F.prototype = Constructor.prototype;

    return function applyConstructor(args) {
        return new F(args);
    };
}

function createApplyPooler(Constructor) {
    var applyConstructor = createApplyConstructor(Constructor);

    return function pooler() {
        var instancePool = Constructor.instancePool,
            instance;

        if (instancePool.length) {
            instance = instancePool.pop();
            Constructor.apply(instance, arguments);
            return instance;
        } else {
            return applyConstructor(arguments);
        }
    };
}

function createReleaser(Constructor) {
    return function releaser(instance) {
        var instancePool = Constructor.instancePool;

        if (isFunction(instance.destructor)) {
            instance.destructor();
        }
        if (Constructor.poolSize === -1 || instancePool.length < Constructor.poolSize) {
            instancePool[instancePool.length] = instance;
        }
    };
}

module.exports = function createPool(Constructor, poolSize) {
    addProperty(Constructor, "instancePool", []);
    addProperty(Constructor, "getPooled", createPooler(Constructor));
    addProperty(Constructor, "release", createReleaser(Constructor));

    if (!Constructor.poolSize) {
        Constructor.poolSize = isNumber(poolSize) ? (poolSize < -1 ? -1 : poolSize) : -1;
    }

    return Constructor;
};


},
function(require, exports, module, global) {

var isFunction = require(5),
    isObjectLike = require(14),
    isNative = require(21);


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

var createPool = require(26);


module.exports = Queue;


function Queue() {
    this.__callbacks = [];
}

createPool(Queue);

Queue.prototype.enqueue = function(callback) {
    var callbacks = this.__callbacks;
    callbacks[callbacks.length] = callback;
    return this;
};

Queue.prototype.notifyAll = function() {
    var callbacks = this.__callbacks,
        i = -1,
        il = callbacks.length - 1;

    while (i++ < il) {
        callbacks[i]();
    }
    callbacks.length = 0;

    return this;
};

Queue.prototype.destructor = function() {
    this.__callbacks.length = 0;
    return this;
};

Queue.prototype.reset = Queue.prototype.destructor;


},
function(require, exports, module, global) {

var keyMirror = require(30);


module.exports = keyMirror([
    "TEXT",
    "REPLACE",
    "PROPS",
    "ORDER",
    "INSERT",
    "REMOVE"
]);


},
function(require, exports, module, global) {

var keys = require(20),
    isArrayLike = require(23);


function keyMirrorArray(array) {
    var i = array.length,
        results = {},
        key;

    while (i--) {
        key = array[i];
        results[key] = array[i];
    }

    return results;
}

function keyMirrorObject(object) {
    var objectKeys = keys(object),
        i = -1,
        il = objectKeys.length - 1,
        results = {},
        key;

    while (i++ < il) {
        key = objectKeys[i];
        results[key] = key;
    }

    return results;
}

module.exports = function keyMirror(object) {
    return isArrayLike(object) ? keyMirrorArray(object) : keyMirrorObject(Object(object));
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = InsertPatch;


function InsertPatch() {
    this.type = consts.INSERT;
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
}
createPool(InsertPatch);

InsertPatch.create = function(id, childId, index, next) {
    var patch = InsertPatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    patch.next = next;
    return patch;
};

InsertPatch.prototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
    return this;
};

InsertPatch.prototype.destroy = function() {
    return InsertPatch.release(this);
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = OrderPatch;


function OrderPatch() {
    this.type = consts.ORDER;
    this.id = null;
    this.order = null;
}
createPool(OrderPatch);

OrderPatch.create = function(id, order) {
    var patch = OrderPatch.getPooled();
    patch.id = id;
    patch.order = order;
    return patch;
};

OrderPatch.prototype.destructor = function() {
    this.id = null;
    this.order = null;
    return this;
};

OrderPatch.prototype.destroy = function() {
    return OrderPatch.release(this);
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = PropsPatch;


function PropsPatch() {
    this.type = consts.PROPS;
    this.id = null;
    this.previous = null;
    this.next = null;
}
createPool(PropsPatch);

PropsPatch.create = function(id, previous, next) {
    var patch = PropsPatch.getPooled();
    patch.id = id;
    patch.previous = previous;
    patch.next = next;
    return patch;
};

PropsPatch.prototype.destructor = function() {
    this.id = null;
    this.previous = null;
    this.next = null;
    return this;
};

PropsPatch.prototype.destroy = function() {
    return PropsPatch.release(this);
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = RemovePatch;


function RemovePatch() {
    this.type = consts.REMOVE;
    this.id = null;
    this.childId = null;
    this.index = null;
}
createPool(RemovePatch);

RemovePatch.create = function(id, childId, index) {
    var patch = RemovePatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    return patch;
};

RemovePatch.prototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    return this;
};

RemovePatch.prototype.destroy = function() {
    return RemovePatch.release(this);
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = ReplacePatch;


function ReplacePatch() {
    this.type = consts.REPLACE;
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
}
createPool(ReplacePatch);

ReplacePatch.create = function(id, childId, index, next) {
    var patch = ReplacePatch.getPooled();
    patch.id = id;
    patch.childId = childId;
    patch.index = index;
    patch.next = next;
    return patch;
};

ReplacePatch.prototype.destructor = function() {
    this.id = null;
    this.childId = null;
    this.index = null;
    this.next = null;
    return this;
};

ReplacePatch.prototype.destroy = function() {
    return ReplacePatch.release(this);
};


},
function(require, exports, module, global) {

var createPool = require(26),
    consts = require(29);


module.exports = TextPatch;


function TextPatch() {
    this.type = consts.TEXT;
    this.id = null;
    this.index = null;
    this.next = null;
}
createPool(TextPatch);

TextPatch.create = function(id, index, next) {
    var patch = TextPatch.getPooled();
    patch.id = id;
    patch.index = index;
    patch.next = next;
    return patch;
};

TextPatch.prototype.destructor = function() {
    this.id = null;
    this.index = null;
    this.next = null;
    return this;
};

TextPatch.prototype.destroy = function() {
    return TextPatch.release(this);
};


},
function(require, exports, module, global) {

var isString = require(15),
    isNumber = require(16),
    isNullOrUndefined = require(11);


module.exports = shouldUpdate;


function shouldUpdate(previous, next) {
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
}


},
function(require, exports, module, global) {

var EventManagerPrototype;


module.exports = EventManager;


function EventManager() {
    this.propNames = [];
    this.__events = {};
}

EventManagerPrototype = EventManager.prototype;

EventManagerPrototype.on = function(id, type, listener, transaction) {
    var events = this.__events,
        event = events[type] || (events[type] = {});

    event[id] = listener;
    transaction.event(id, type);
};

EventManagerPrototype.off = function(id, type, transaction) {
    var events = this.__events,
        event = events[type];

    if (event[id] !== undefined) {
        delete event[id];
        transaction.removeEvent(id, type);
    }
};

EventManagerPrototype.get = function(id, type) {
    var events = this.__events,
        event = events[type];

    if (event !== undefined) {
        return event[id];
    } else {
        return null;
    }
};

EventManagerPrototype.allOff = function(id, transaction) {
    var events = this.__events,
        event, type;

    for (type in events) {
        if ((event = events[type])[id] !== undefined) {
            delete event[id];
            transaction.removeEvent(id, type);
        }
    }
};


},
function(require, exports, module, global) {

var indexOf = require(40),
    has = require(18),
    map = require(19),
    isFunction = require(5),
    getComponentClassForType = require(41),
    View = require(9),
    getViewKey = require(47),
    diff;


var NodePrototype,
    isPrimativeView = View.isPrimativeView;


module.exports = Node;


function Node() {
    this.id = null;

    this.parent = null;
    this.children = [];
    this.root = null;

    this.component = null;

    this.renderedView = null;
    this.currentView = null;
}

NodePrototype = Node.prototype;

Node.create = function(view) {
    var node = new Node(),
        Class, component;

    if (isFunction(view.type)) {
        Class = view.type;
    } else {
        Class = getComponentClassForType(view.type);
    }

    component = new Class(view.props, view.children);
    component.__node = node;
    node.component = component;
    node.currentView = view;

    return node;
};

NodePrototype.appendNode = function(node) {
    var children = this.children;

    node.parent = this;
    children[children.length] = node;
    this.root.appendNode(node);
};

NodePrototype.removeNode = function(node, transaction) {
    var children = this.children;

    node.removeChildren(transaction);
    node.__unmount(transaction);
    node.parent = null;
    children.splice(indexOf(children, node), 1);
    this.root.removeNode(node);
};

NodePrototype.removeChildren = function(transaction) {
    var children = this.children,
        i = -1,
        il = children.length - 1;

    while (i++ < il) {
        this.removeNode(children[i], transaction);
    }
};

NodePrototype.mount = function(transaction) {
    transaction.insert(this.parent ? this.parent.id : this.id, this.id, 0, this.__renderRecurse(transaction));
};

NodePrototype.__mount = function(transaction) {
    var component = this.component,
        renderedView = this.renderedView;

    mountEvents(this.id, renderedView.props, this.root.eventManager, transaction);

    component.componentWillMount();

    transaction.queue.enqueue(function onMount() {
        component.componentDidMount();
    });
};

NodePrototype.__renderRecurse = function(transaction) {
    var _this = this,
        parentId = this.id,
        renderedView = this.render();

    renderedView.children = map(renderedView.children, function(child, index) {
        var node;

        if (isPrimativeView(child)) {
            return child;
        } else {
            node = Node.create(child);
            node.id = parentId + "." + getViewKey(child, index);
            _this.appendNode(node);

            return node.__renderRecurse(transaction);
        }
    });

    this.renderedView = renderedView;
    this.__mount(transaction);

    return renderedView;
};

NodePrototype.unmount = function(transaction) {
    var parentId = this.parent ? this.parent.id : this.id;

    if (this.parent !== null) {
        this.parent.removeNode(this, transaction);
    } else {
        this.removeChildren(transaction);
        this.root.removeNode(this);
    }

    transaction.remove(parentId, this.id, 0);
};

NodePrototype.__unmount = function(transaction) {
    var component = this.component;

    this.root.eventManager.allOff(this.id, transaction);

    component.componentWillUnmount();
};

NodePrototype.update = function(nextView, transaction) {
    var component = this.component;

    this.__update(
        component.props, nextView.props,
        component.children, nextView.children,
        component.__previousState, component.state,
        nextView,
        transaction
    );
};

diff = require(48);

NodePrototype.__update = function(
    previousProps, nextProps,
    previousChildren, nextChildren,
    previousState, nextState,
    currentView,
    transaction
) {
    var component = this.component,
        renderedView;

    component.componentWillReceiveProps(nextProps, nextChildren);

    if (component.shouldComponentUpdate(nextProps, nextChildren, nextState)) {

        component.props = nextProps;
        component.children = nextChildren;

        component.componentWillUpdate();

        renderedView = this.render();
        diff(this, this.renderedView, renderedView, transaction);
        this.renderedView = renderedView;
    } else {
        component.props = nextProps;
        component.children = nextChildren;
    }

    this.currentView = currentView;

    transaction.queue.enqueue(function onUpdate() {
        component.componentDidUpdate(previousProps, previousChildren, previousState);
    });
};

NodePrototype.render = function() {
    var currentView = this.currentView,
        renderedView = this.component.render();

    renderedView.key = currentView.key;
    renderedView.ref = currentView.ref;

    return renderedView;
};

function mountEvents(id, props, eventManager, transaction) {
    var eventPropNames = eventManager.propNames,
        key;

    for (key in props) {
        if (indexOf(eventPropNames, key) !== -1) {
            eventManager.on(id, key, props[key], transaction);
        }
    }
}


},
function(require, exports, module, global) {

var isLength = require(13),
    isObjectLike = require(14);


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

var View = require(9),
    Component = require(42);


var nativeComponents = {};


module.exports = getComponentClassForType;


function getComponentClassForType(type) {
    var Class = nativeComponents[type];

    if (Class) {
        return Class;
    } else {
        return (nativeComponents[type] = createNativeComponentForType(type));
    }
}

function createNativeComponentForType(type) {
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

var inherits = require(43),
    extend = require(45);


var ComponentPrototype;


module.exports = Component;


function Component(props, children) {
    this.__node = null;
    this.__previousState = null;
    this.props = props;
    this.children = children;
    this.state = null;
    this.refs = null;
}

ComponentPrototype = Component.prototype;

Component.extend = function(child, displayName) {
    inherits(child, this);
    child.displayName = child.prototype.displayName = displayName || ComponentPrototype.displayName;
    return child;
};

ComponentPrototype.displayName = "Component";
ComponentPrototype.propTypes = {};
ComponentPrototype.contextTypes = {};

ComponentPrototype.render = function() {
    throw new Error("render() render must be defined on Components");
};

ComponentPrototype.setState = function(state) {
    var node = this.__node;

    this.__previousState = this.state;
    this.state = extend({}, this.state, state);

    node.root.update(node);
};

ComponentPrototype.forceUpdate = function() {
    var node = this.__node;
    node.root.update(node);
};

ComponentPrototype.componentDidMount = function() {};

ComponentPrototype.componentDidUpdate = function( /* previousProps, previousChildren, previousState */ ) {};

ComponentPrototype.componentWillMount = function() {};

ComponentPrototype.componentWillUnmount = function() {};

ComponentPrototype.componentWillReceiveProps = function( /* nextProps, nextChildren */ ) {};

ComponentPrototype.componentWillUpdate = function( /* nextProps, nextChildren, nextState */ ) {};

ComponentPrototype.shouldComponentUpdate = function( /* nextProps, nextChildren, nextState */ ) {
    return true;
};


},
function(require, exports, module, global) {

var create = require(44),
    extend = require(45),
    mixin = require(46),
    defineProperty = require(27);


var descriptor = {
    configurable: true,
    enumerable: false,
    writable: true,
    value: null
};


function defineNonEnumerableProperty(object, name, value) {
    descriptor.value = value;
    defineProperty(object, name, descriptor);
    descriptor.value = null;
}

function defineStatic(name, value) {
    defineNonEnumerableProperty(this, name, value);
}

function inherits(child, parent) {

    mixin(child, parent);

    child.prototype = extend(create(parent.prototype), child.prototype);

    defineNonEnumerableProperty(child, "__super", parent.prototype);
    defineNonEnumerableProperty(child.prototype, "constructor", child);

    child.defineStatic = defineStatic;
    child.super_ = parent; // support node

    return child;
}

inherits.defineProperty = defineNonEnumerableProperty;


module.exports = inherits;


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

var keys = require(20);


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

var keys = require(20),
    isNullOrUndefined = require(11);


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

var isNullOrUndefined = require(11);


var reEscape = /[=.:]/g;


module.exports = getViewKey;


function getViewKey(view, index) {
    var key = view.key;

    if (isNullOrUndefined(key)) {
        return index.toString(36);
    } else {
        return wrapKey(escapeKey(key));
    }
}

function escapeKey(key) {
    return (key + "").replace(reEscape, "$");
}

function wrapKey(key) {
    return "$" + key;
}


},
function(require, exports, module, global) {

var getViewKey = require(47),
    shouldUpdate = require(37),
    isNullOrUndefined = require(11),
    diffProps = require(49),
    View = require(9),
    Node;


var isPrimativeView = View.isPrimativeView;


module.exports = diff;


Node = require(39);


function diff(node, previous, next, transaction) {
    var id = node.id,
        propsDiff = diffProps(id, node.root.eventManager, transaction, previous.props, next.props);

    if (propsDiff !== null) {
        transaction.props(id, previous.props, propsDiff);
    }

    return diffChildren(node, previous, next, transaction);
}

function diffChildren(node, previous, next, transaction) {
    var previousChildren = previous.children,
        nextChildren = reorder(previousChildren, next.children),
        previousLength = previousChildren.length,
        nextLength = nextChildren.length,
        parentId = node.id,
        i = -1,
        il = (previousLength > nextLength ? previousLength : nextLength) - 1;

    while (i++ < il) {
        diffChild(node, previousChildren[i], nextChildren[i], transaction, parentId, i);
    }

    if (nextChildren.moves) {
        transaction.order(parentId, nextChildren.moves);
    }
}

function diffChild(parentNode, previousChild, nextChild, transaction, parentId, index) {
    var node, id;

    if (previousChild !== nextChild) {
        if (isNullOrUndefined(previousChild)) {
            if (isPrimativeView(nextChild)) {
                transaction.insert(parentId, null, index, nextChild);
            } else {
                node = Node.create(nextChild);
                id = node.id = parentId + "." + getViewKey(nextChild, index);
                parentNode.appendNode(node);
                transaction.insert(parentId, id, index, node.__renderRecurse(transaction));
            }
        } else if (isPrimativeView(previousChild)) {
            if (isNullOrUndefined(nextChild)) {
                transaction.remove(parentId, null, index);
            } else if (isPrimativeView(nextChild)) {
                transaction.text(parentId, index, nextChild);
            } else {
                node = Node.create(nextChild);
                id = node.id = parentId + "." + getViewKey(nextChild, index);
                parentNode.appendNode(node);
                transaction.replace(parentId, id, index, node.__renderRecurse(transaction));
            }
        } else {
            if (isNullOrUndefined(nextChild)) {
                id = parentId + "." + getViewKey(previousChild, index);
                node = parentNode.root.childHash[id];
                node.unmount(transaction);
            } else if (isPrimativeView(nextChild)) {
                transaction.replace(parentId, null, index, nextChild);
            } else {
                id = parentId + "." + getViewKey(previousChild, index);
                node = parentNode.root.childHash[id];

                if (node) {
                    if (shouldUpdate(previousChild, nextChild)) {
                        node.update(nextChild, transaction);
                        return;
                    } else {
                        node.unmount(transaction);
                    }
                }

                node = Node.create(nextChild);
                id = node.id = parentId + "." + getViewKey(nextChild, index);
                parentNode.appendNode(node);
                transaction.insert(parentId, id, index, node.__renderRecurse(transaction));
            }
        }
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

        if (!isNullOrUndefined(child.key)) {
            keys = keys || {};
            keys[child.key] = i;
        }
    }

    return keys;
}


},
function(require, exports, module, global) {

var indexOf = require(40),
    isObject = require(4),
    getPrototypeOf = require(50),
    isNullOrUndefined = require(11);


module.exports = diffProps;


function diffProps(id, eventManager, transaction, previous, next) {
    var result = null,
        eventPropNames = eventManager.propNames,
        key, previousValue, nextValue, propsDiff;

    for (key in previous) {
        nextValue = next[key];

        if (isNullOrUndefined(nextValue)) {
            result = result || {};
            result[key] = undefined;

            if (indexOf(eventPropNames, key) !== -1) {
                eventManager.off(id, key, transaction);
            }
        } else {
            previousValue = previous[key];

            if (previousValue === nextValue) {
                continue;
            } else if (isObject(previousValue) && isObject(nextValue)) {
                if (getPrototypeOf(previousValue) !== getPrototypeOf(nextValue)) {
                    result = result || {};
                    result[key] = nextValue;
                } else {
                    propsDiff = diffProps(id, eventManager, transaction, previousValue, nextValue);
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
            nextValue = next[key];

            result = result || {};
            result[key] = nextValue;

            if (indexOf(eventPropNames, key) !== -1) {
                eventManager.on(id, key, nextValue, transaction);
            }
        }
    }

    return result;
}


},
function(require, exports, module, global) {

var isObject = require(4),
    isNative = require(21);


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

var virt = require(8),
    Adaptor = require(52),
    renderString = require(62),
    getRootNodeInContainer = require(68),
    getNodeId = require(65),
    getNodeById = require(56);


var rootsById = {};


module.exports = render;


function render(nextView, containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode),
        root;

    if (id === null) {
        root = new virt.Root();
        root.adaptor = new Adaptor(root, containerDOMNode);
        id = root.id;
        rootsById[id] = root;
    } else {
        root = rootsById[id];
    }

    root.render(nextView, id);
}

render.renderString = function(view, id) {
    return renderString(view, id || ".0");
};

render.unmount = function(containerDOMNode) {
    var rootDOMNode = getRootNodeInContainer(containerDOMNode),
        id = getNodeId(rootDOMNode);

    if (id !== null) {
        delete rootsById[id];
    }
};

render.findDOMNode = function(component) {
    return (component && component.__node) ? getNodeById(component.__node.id) : null;
};


},
function(require, exports, module, global) {

var eventPropNames = require(53),
    applyEvents = require(54),
    applyPatches = require(55);


var AdaptorPrototype;


module.exports = Adaptor;


function Adaptor(root, containerDOMNode) {
    root.eventManager.propNames = eventPropNames;
    this.root = root;
    this.containerDOMNode = containerDOMNode;
    this.ownerDocument = containerDOMNode.ownerDocument;
}

AdaptorPrototype = Adaptor.prototype;

AdaptorPrototype.handle = function(transaction, callback) {
    var containerDOMNode = this.containerDOMNode,
        ownerDocument = this.ownerDocument;

    applyPatches(transaction.patches, containerDOMNode, ownerDocument);
    applyEvents(transaction.removeEvents, true);
    applyEvents(transaction.events, false);
    applyPatches(transaction.removes, containerDOMNode, ownerDocument);

    callback();
};


},
function(require, exports, module, global) {

module.exports = [
    "onCopy",
    "onCut",
    "onPaste",
    "onKeydown",
    "onKeyup",
    "onKeypress",
    "onFocus",
    "onBlur",
    "onChange",
    "onInput",
    "onSubmit",
    "onClick",
    "onDoubleClick",
    "onMouseDown",
    "onMouseEnter",
    "onMouseLeave",
    "onMouseMove",
    "onMouseOut",
    "onMouseOver",
    "onMouseUp",
    "onDrag",
    "onDragEnd",
    "onDragEnter",
    "onDragExit",
    "onDragLeave",
    "onDragOver",
    "onDragStart",
    "onDragDrop",
    "onTouchCancel",
    "onTouchEnd",
    "onTouchMove",
    "onTouchStart",
    "onScroll",
    "onWheel"
];


},
function(require, exports, module, global) {

var has = require(18);


module.exports = applyEvents;


function applyEvents(events, remove) {
    if (remove !== true) {
        addEvents(events);
    } else {
        removeEvents(events);
    }
}

function addEvents(events) {
    var id, type;

    for (id in events) {
        if (has(events, id)) {
            type = events[id];
        }
    }
}

function removeEvents(events) {
    var id, type;

    for (id in events) {
        if (has(events, id)) {
            type = events[id];
        }
    }
}


},
function(require, exports, module, global) {

var getNodeById = require(56),
    applyPatch = require(58);


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, ownerDocument) {
    var id;

    for (id in hash) {
        if (hash[id] !== undefined) {
            applyPatchIndices(getNodeById(id) || rootDOMNode, hash[id], id, ownerDocument);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, ownerDocument) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], DOMNode, id, ownerDocument);
    }
}


},
function(require, exports, module, global) {

var nodeCache = require(57);


module.exports = getNodeById;


function getNodeById(id) {
    return nodeCache[id];
}


},
function(require, exports, module, global) {




},
function(require, exports, module, global) {

var consts = require(29),
    createDOMElement = require(59),
    renderString = require(62),
    addDOMNodes = require(63),
    removeDOMNodes = require(67),
    getNodeById = require(56),
    applyProperties = require(61);



module.exports = applyPatch;


function applyPatch(patch, node, id, ownerDocument) {
    switch (patch.type) {
        case consts.REMOVE:
            remove(node, patch.childId, patch.index);
            break;
        case consts.INSERT:
            insert(node, patch.childId, patch.index, patch.next, ownerDocument);
            break;
        case consts.TEXT:
            text(node, patch.index, patch.next);
            break;
        case consts.REPLACE:
            replace(node, patch.childId, patch.index, patch.next, ownerDocument);
            break;
        case consts.ORDER:
            order(node, patch.order);
            break;
        case consts.PROPS:
            applyProperties(node, patch.id, patch.next, patch.previous);
            break;
    }
}

function remove(parentNode, id, index) {
    var node;

    if (id === null) {
        node = parentNode.childNodes[index];
    } else {
        node = getNodeById(id);
        removeDOMNodes(node.childNodes);
    }

    if (node) {
        parentNode.removeChild(node);
    }
}

function insert(parentNode, id, index, view, ownerDocument) {
    var node = createDOMElement(view, id, ownerDocument, false);

    if (view.children) {
        node.innerHTML = renderString(view.children, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.appendChild(node);
}

function text(parentNode, index, value) {
    var textNode = parentNode.childNodes[index];

    if (textNode) {
        textNode.nodeValue = value;
    }
}

function replace(parentNode, id, index, view, ownerDocument) {
    var node = createDOMElement(view, id, ownerDocument, false);

    if (view.children) {
        node.innerHTML = renderString(view.children, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.replaceChild(node, parentNode.childNodes[index]);
}

var order_children = [];

function order(parentNode, orderIndex) {
    var children = order_children,
        childNodes = parentNode.childNodes,
        reverseIndex = orderIndex.reverse,
        removes = orderIndex.removes,
        insertOffset = 0,
        i = -1,
        length = childNodes.length - 1,
        move, node, insertNode;

    children.length = length;
    while (i++ < length) {
        children[i] = childNodes[i];
    }

    i = -1;
    while (i++ < length) {
        move = orderIndex[i];

        if (move !== undefined && move !== i) {
            if (reverseIndex[i] > i) {
                insertOffset++;
            }

            node = children[move];
            insertNode = childNodes[i + insertOffset] || null;

            if (node !== insertNode) {
                parentNode.insertBefore(node, insertNode);
            }

            if (move < i) {
                insertOffset--;
            }
        }

        if (removes[i] != null) {
            insertOffset++;
        }
    }
}


},
function(require, exports, module, global) {

var DOM_ID_NAME = require(60),
    nodeCache = require(57),

    applyProperties = require(61),

    virt = require(8),
    getViewKey = require(47);


var View = virt.View,
    isView = View.isView,
    isPrimativeView = View.isPrimativeView;


module.exports = createDOMElement;


function createDOMElement(view, id, ownerDocument, recurse) {
    var node, children, i, length, child;

    if (isPrimativeView(view)) {
        return ownerDocument.createTextNode(view);
    } else if (isView(view)) {
        node = ownerDocument.createElement(view.type);

        applyProperties(node, id, view.props, undefined);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        if (recurse !== false) {
            children = view.children;
            i = -1;
            length = children.length - 1;

            while (i++ < length) {
                child = children[i];
                node.appendChild(createDOMElement(child, id + "." + getViewKey(child, i), ownerDocument));
            }
        }

        return node;
    } else {
        throw new TypeError("Arguments is not a valid view");
    }
}


},
function(require, exports, module, global) {

module.exports = "data-virtid";


},
function(require, exports, module, global) {

var isString = require(15),
    isObject = require(4),
    isFunction = require(5),
    getPrototypeOf = require(50);


module.exports = applyProperties;


function applyProperties(node, id, props, previous) {
    var propKey, propValue;

    for (propKey in props) {
        if (!isFunction((propValue = props[propKey]))) {
            if (propValue == null && previous != null) {
                removeProperty(node, id, previous, propKey);
            } else if (isObject(propValue)) {
                applyObject(node, previous, propKey, propValue);
            } else if (propValue != null && (!previous || previous[propKey] !== propValue)) {
                applyProperty(node, id, propKey, propValue);
            }
        }
    }
}

function applyProperty(node, id, propKey, propValue) {
    if (propKey !== "className" && node.setAttribute) {
        node.setAttribute(propKey, propValue);
    } else {
        node[propKey] = propValue;
    }
}

function removeProperty(node, id, previous, propKey) {
    var canRemoveAttribute = !!node.removeAttribute,
        previousValue = previous[propKey],
        keyName, style;

    if (propKey === "attributes") {
        for (keyName in previousValue) {
            if (canRemoveAttribute) {
                node.removeAttribute(keyName);
            } else {
                node[keyName] = isString(previousValue[keyName]) ? "" : null;
            }
        }
    } else if (propKey === "style") {
        style = node.style;

        for (keyName in previousValue) {
            style[keyName] = "";
        }
    } else {
        if (propKey !== "className" && canRemoveAttribute) {
            node.removeAttribute(propKey);
        } else {
            node[propKey] = isString(previousValue) ? "" : null;
        }
    }
}

function applyObject(node, previous, propKey, propValues) {
    var previousValue, key, value, nodeProps, replacer;

    if (propKey === "attributes") {
        for (key in propValues) {
            value = propValues[key];

            if (value === undefined) {
                node.removeAttribute(key);
            } else {
                node.setAttribute(key, value);
            }
        }

        return;
    }

    previousValue = previous ? previous[propKey] : undefined;

    if (
        previousValue != null &&
        isObject(previousValue) &&
        getPrototypeOf(previousValue) !== getPrototypeOf(propValues)
    ) {
        node[propKey] = propValues;
        return;
    }

    nodeProps = node[propKey];

    if (!isObject(nodeProps)) {
        nodeProps = node[propKey] = {};
    }

    replacer = propKey === "style" ? "" : undefined;

    for (key in propValues) {
        value = propValues[key];
        nodeProps[key] = (value === undefined) ? replacer : value;
    }
}


},
function(require, exports, module, global) {

var virt = require(8),
    getViewKey = require(47),

    isFunction = require(5),
    isArray = require(12),
    map = require(19),
    isString = require(15),
    isObject = require(4),
    isNullOrUndefined = require(11),

    DOM_ID_NAME = require(60);


var View = virt.View,
    isPrimativeView = View.isPrimativeView,

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


module.exports = function(view, id) {
    if (isArray(view)) {
        return map(view, function(v, i) {
            return render(v, id + "." + getViewKey(v, i));
        }).join("");
    } else {
        return render(view, id);
    }
};


function render(view, id) {
    var type;

    if (isPrimativeView(view)) {
        return view + "";
    } else {
        type = view.type;

        return (
            closedTags[type] !== true ?
            contentTag(type, map(view.children, function(child, i) {
                return render(child, id + "." + getViewKey(child, i));
            }).join(""), id, view.props) :
            closedTag(type, id, view.props)
        );
    }
}

function baseTagOptions(id, options) {
    var attributes = "",
        key, value;

    for (key in options) {
        value = options[key];

        if (!isNullOrUndefined(value) && !isFunction(value)) {
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

function tagOptions(id, options) {
    var attributes = baseTagOptions(id, options);
    return attributes !== "" ? " " + attributes : attributes;
}

function dataId(id) {
    return ' ' + DOM_ID_NAME + '="' + id + '"';
}

function closedTag(type, id, options) {
    return "<" + type + (isObject(options) ? tagOptions(id, options) : "") + dataId(id) + "/>";
}

function contentTag(type, content, id, options) {
    return (
        "<" + type + (isObject(options) ? tagOptions(id, options) : "") + dataId(id) + ">" +
        (isString(content) ? content : "") +
        "</" + type + ">"
    );
}


},
function(require, exports, module, global) {

var isElement = require(64),
    getNodeId = require(65);


module.exports = addDOMNodes;


function addDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        addDOMNode(nodes[i]);
    }
}

function addDOMNode(node) {
    if (isElement(node)) {
        getNodeId(node);
        addDOMNodes(node.childNodes);
    }
}


},
function(require, exports, module, global) {

var isNode = require(7);


module.exports = function isElement(obj) {
    return isNode(obj) && obj.nodeType === 1;
};


},
function(require, exports, module, global) {

var has = require(18),
    nodeCache = require(57),
    getNodeAttributeId = require(66);


module.exports = getNodeId;


function getNodeId(node) {
    return node && getId(node);
}

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


},
function(require, exports, module, global) {

var DOM_ID_NAME = require(60);


module.exports = getNodeAttributeId;


function getNodeAttributeId(node) {
    return node && node.getAttribute && node.getAttribute(DOM_ID_NAME) || "";
}


},
function(require, exports, module, global) {

var isElement = require(64),
    nodeCache = require(57),
    getNodeAttributeId = require(66);


module.exports = removeDOMNodes;


function removeDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        removeDOMNode(nodes[i]);
    }
}

function removeDOMNode(node) {
    if (isElement(node)) {
        delete nodeCache[getNodeAttributeId(node)];
        removeDOMNodes(node.childNodes);
    }
}


},
function(require, exports, module, global) {

module.exports = getRootNodeInContainer;


function getRootNodeInContainer(containerNode) {
    if (!containerNode) {
        return null;
    } else {
        if (containerNode.nodeType === 9) {
            return containerNode.documentElement;
        } else {
            return containerNode.firstChild;
        }
    }
}


},
function(require, exports, module, global) {

var virt = require(8),
    TodoList = require(70),
    TodoForm = require(79);


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
            virt.createView(TodoForm),
            virt.createView(TodoList)
        )
    );
};


},
function(require, exports, module, global) {

var virt = require(8),
    map = require(19),
    dispatcher = require(71),
    TodoStore = require(73),
    TodoItem = require(75);


var TodoListPrototype;


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

var EventEmitter = require(72);


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
    inherits = require(43),
    fastSlice = require(17),
    defineProperty = require(27),
    keys = require(20);


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

var EventEmitter = require(72),
    values = require(74),
    dispatcher = require(71);


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
    var id = _todoId++,
        todo = _todos[id] = {
            id: id,
            text: text
        };

    callback(undefined, todo);
}

function update(id, text, callback) {
    var todo = _todos[id];

    todo.text = text;

    callback(undefined, todo);
}

function destroy(id, callback) {
    var todo = _todos[id];

    delete _todos[id];

    callback(undefined, todo);
}

TodoStore.all = function(callback) {
    callback(undefined, values(_todos));
};

TodoStore.show = function(id, callback) {
    callback(undefined, _todos[id]);
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

var keys = require(20);


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
    propTypes = require(76);


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

var isArray = require(12),
    isRegExp = require(77),
    isNullOrUndefined = require(11),
    emptyFunction = require(78),
    isFunction = require(5),
    has = require(18),
    indexOf = require(40);


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

var isObjectLike = require(14);


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


},
function(require, exports, module, global) {

var virt = require(8),
    virtDOM = require(51),
    eventListener = require(2),
    dispatcher = require(71),
    TodoStore = require(73);


var TodoFormPrototype;


module.exports = TodoForm;


function TodoForm(props, children) {
    var _this = this;

    virt.Component.call(this, props, children);

    this.onSubmit = function(e) {
        return _this.__onSubmit(e);
    };

    this.onChange = function(e) {
        return _this.__onChange(e);
    };
}
virt.Component.extend(TodoForm, "TodoForm");

TodoFormPrototype = TodoForm.prototype;

TodoFormPrototype.componentDidMount = function() {

};

TodoFormPrototype.componentWillUnmount = function() {

};

TodoFormPrototype.__onSubmit = function(e) {
    var DOMNode = virtDOM.findDOMNode(this).childNodes[0].childNodes[0],
        value = DOMNode.value;

    e.preventDefault();

    if (value) {
        dispatcher.handleViewAction({
            actionType: TodoStore.consts.TODO_CREATE,
            text: value
        });
        DOMNode.value = "";
    }
};

TodoFormPrototype.__onChange = function(e) {
    console.log(e);
};

TodoFormPrototype.render = function() {
    return (
        virt.createView("div", {
                className: "todo-form"
            },
            virt.createView("form", {
                    onSubmit: this.onSubmit
                },
                virt.createView("input", {
                    type: "text",
                    name: "name",
                    ref: "name",
                    placeholder: "Todo",
                    onChange: this.onChange
                })
            )
        )
    );
};


}], (new Function("return this;"))()));
