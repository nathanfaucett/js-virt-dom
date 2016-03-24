var domCaret = require("dom_caret"),
    blurNode = require("blur_node"),
    focusNode = require("focus_node"),
    findDOMNode = require("../utils/findDOMNode");


var sharedInputHandlers = exports;


sharedInputHandlers.getValue = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, node.value);
    } else {
        callback(new Error("getValue: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.setValue = function(data, callback) {
    var node = findDOMNode(data.id),
        origValue, value, focus, caret, end, origLength;

    if (node) {
        origValue = node.value;
        value = data.value || "";
        focus = data.focus !== false;

        if (value !== origValue) {
            if (focus) {
                caret = domCaret.get(node);
            }
            node.value = value;
            if (focus) {
                origLength = origValue.length;
                end = caret.end;

                if (end < origLength) {
                    domCaret.set(node, caret.start, caret.end);
                }
            }
        }
        callback();
    } else {
        callback(new Error("setValue: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.getSelection = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        callback(undefined, domCaret.get(node));
    } else {
        callback(new Error("getSelection: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.setSelection = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        domCaret.set(node, data.start, data.end);
        callback();
    } else {
        callback(new Error("setSelection: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.focus = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        focusNode(node);
        callback();
    } else {
        callback(new Error("focus: No DOM node found with id " + data.id));
    }
};

sharedInputHandlers.blur = function(data, callback) {
    var node = findDOMNode(data.id);

    if (node) {
        blurNode(node);
        callback();
    } else {
        callback(new Error("blur: No DOM node found with id " + data.id));
    }
};
