var DOM_ID_NAME = require("../DOM_ID_NAME");


module.exports = getNodeAttributeId;


function getNodeAttributeId(node) {
    return node && node.getAttribute && node.getAttribute(DOM_ID_NAME) || "";
}
