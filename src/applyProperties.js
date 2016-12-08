var isString = require("@nathanfaucett/is_string"),
    isObject = require("@nathanfaucett/is_object"),
    isUndefined = require("@nathanfaucett/is_undefined"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    getPrototypeOf = require("@nathanfaucett/get_prototype_of");


module.exports = applyProperties;


function applyProperties(node, id, props, previous) {
    var propKey, propValue;

    for (propKey in props) {
        propValue = props[propKey];

        if (isNullOrUndefined(propValue) && !isNullOrUndefined(previous)) {
            removeProperty(node, id, previous, propKey);
        } else if (isObject(propValue)) {
            applyObject(node, previous, propKey, propValue);
        } else if (!isNullOrUndefined(propValue) && (!previous || previous[propKey] !== propValue)) {
            applyProperty(node, id, propKey, propValue);
        }
    }
}

function applyProperty(node, id, propKey, propValue) {
    if (propKey === "dangerouslySetInnerHTML") {
        node.innerHTML = propValue;
    } else if (propKey !== "className" && node.setAttribute) {
        node.setAttribute(propKey, propValue);
    } else {
        node[propKey] = propValue;
    }
}

function removeProperty(node, id, previous, propKey) {
    var canRemoveAttribute = !!node.removeAttribute,
        previousValue = previous[propKey];

    if (propKey === "dangerouslySetInnerHTML") {
        node.innerHTML = "";
    } else if (propKey === "attributes") {
        removeAttributes(node, previousValue, canRemoveAttribute);
    } else if (propKey === "style") {
        removeStyles(node, previousValue);
    } else {
        if (propKey !== "className" && canRemoveAttribute) {
            node.removeAttribute(propKey);
        } else {
            node[propKey] = isString(previousValue) ? "" : null;
        }
    }
}

function removeAttributes(node, previousValue, canRemoveAttribute) {
    for (var keyName in previousValue) {
        if (canRemoveAttribute) {
            node.removeAttribute(keyName);
        } else {
            node[keyName] = isString(previousValue[keyName]) ? "" : null;
        }
    }
}

function removeStyles(node, previousValue) {
    var style = node.style;

    for (var keyName in previousValue) {
        style[keyName] = "";
    }
}

function applyObject(node, previous, propKey, propValues) {
    var previousValue;

    if (propKey === "attributes") {
        setAttributes(node, propValues);
    } else {
        previousValue = previous ? previous[propKey] : void(0);

        if (!isNullOrUndefined(previousValue) &&
            isObject(previousValue) &&
            getPrototypeOf(previousValue) !== getPrototypeOf(propValues)
        ) {
            node[propKey] = propValues;
        } else {
            setObject(node, propKey, propValues);
        }
    }
}

function setAttributes(node, propValues) {
    var value;

    for (var key in propValues) {
        value = propValues[key];

        if (isUndefined(value)) {
            node.removeAttribute(key);
        } else {
            node.setAttribute(key, value);
        }
    }
}

function setObject(node, propKey, propValues) {
    var nodeProps = node[propKey],
        replacer, value;

    if (!isObject(nodeProps)) {
        nodeProps = node[propKey] = {};
    }

    replacer = propKey === "style" ? "" : void(0);

    for (var key in propValues) {
        value = propValues[key];
        nodeProps[key] = isUndefined(value) ? replacer : value;
    }
}