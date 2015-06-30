var isString = require("is_string"),
    getNodeById = require("./getNodeById");


module.exports = findDOMNode;


function findDOMNode(value) {
    if (isString(value)) {
        return getNodeById(value);
    } else if (value && value.__node) {
        return getNodeById(value.__node.id);
    } else if (value && value.id) {
        return getNodeById(value.id);
    } else {
        return null;
    }
}
