var virt = require("virt"),
    isString = require("is_string"),
    eventHandlersById = require("../eventHandlersById");


var getRootIdFromId = virt.getRootIdFromId;


module.exports = findDOMNode;


function findDOMNode(value) {
    if (isString(value)) {
        return eventHandlersById[getRootIdFromId(value)];
    } else {
        return null;
    }
}
