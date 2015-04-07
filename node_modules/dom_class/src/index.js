var trim = require("trim"),
    isArray = require("is_array"),
    isString = require("is_string"),
    isElement = require("is_element");


var domClass = exports,

    CLASS_REMOVE = /[\t\r\n\f]/g,
    SPLITER = /[\s, ]+/;


domClass.add = function(node, names) {
    var classNames, i, current, className, finalValue;

    if (isElement(node)) {
        current = node.className ? (" " + node.className + " ").replace(CLASS_REMOVE, " ") : " ";

        if (current) {
            classNames = isArray(names) ? names : (isString(names) ? names.split(SPLITER) : []);
            i = classNames.length;

            while (i--) {
                className = classNames[i];

                if (current.indexOf(" " + className + " ") === -1) {
                    current += className + " ";
                }

                finalValue = trim(current);
                if (node.className !== finalValue) {
                    node.className = finalValue;
                }
            }
        }
    }
};

domClass.remove = function(node, names) {
    var classNames, i, current, className, finalValue;

    if (isElement(node)) {
        current = node.className ? (" " + node.className + " ").replace(CLASS_REMOVE, " ") : " ";

        if (current) {
            classNames = isArray(names) ? names : (isString(names) ? names.split(SPLITER) : []);
            i = classNames.length;

            while (i--) {
                className = classNames[i];

                if (current.indexOf(" " + className + " ") !== -1) {
                    current = current.replace(" " + className + " ", " ");
                }

                finalValue = trim(current);
                if (node.className !== finalValue) {
                    node.className = finalValue;
                }
            }
        }
    }
};

domClass.has = function(node, names) {
    var classNames, i, current, className;

    if (isElement(node)) {
        current = node.className ? (" " + node.className + " ").replace(CLASS_REMOVE, " ") : " ";

        if (current) {
            classNames = isArray(names) ? names : (isString(names) ? names.split(SPLITER) : []);
            i = classNames.length;

            while (i--) {
                className = classNames[i];

                if (current.indexOf(" " + className + " ") !== -1) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
