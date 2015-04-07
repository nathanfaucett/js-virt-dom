var isNode = require("is_node");


module.exports = function isElement(obj) {
    return isNode(obj) && obj.nodeType === 1;
};
