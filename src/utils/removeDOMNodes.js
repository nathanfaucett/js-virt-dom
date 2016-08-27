module.exports = removeDOMNodes;


var removeDOMNode = require("./removeDOMNode");


function removeDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        removeDOMNode(nodes[i]);
    }
}