var isString = require("is_string"),
    isObject = require("is_object"),
    isFunction = require("is_function"),
    getPrototypeOf = require("get_prototype_of"),
    events = require("virt/event/events");


module.exports = applyProperties;


function applyProperties(node, id, props, previous, eventHandler) {
    var propKey, propValue;

    for (propKey in props) {
        propValue = props[propKey];

        if (propValue == null && previous != null) {
            removeProperty(node, id, previous, propKey, eventHandler);
        } else if (isObject(propValue) && !isFunction(propValue)) {
            applyObject(node, previous, propKey, propValue);
        } else if (propValue != null && (!previous || previous[propKey] !== propValue)) {
            applyProperty(node, id, propKey, propValue, eventHandler);
        }
    }
}

function applyProperty(node, id, propKey, propValue, eventHandler) {
    var eventType;

    if ((eventType = events[propKey]) !== undefined) {
        eventHandler.on(id, eventType);
    } else if (propKey !== "className" && node.setAttribute) {
        node.setAttribute(propKey, propValue);
    } else {
        node[propKey] = propValue;
    }
}

function removeProperty(node, id, previous, propKey, eventHandler) {
    var canRemoveAttribute = !!node.removeAttribute,
        previousValue = previous[propKey],
        keyName, eventType, style;

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
    } else if ((eventType = events[propKey]) !== undefined) {
        eventHandler.off(id, eventType);
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
