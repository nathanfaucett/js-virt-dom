var isNode = require("is_node");


module.exports = function isDocument(obj) {
    return isNode(obj) && obj.nodeType === 9;
};
