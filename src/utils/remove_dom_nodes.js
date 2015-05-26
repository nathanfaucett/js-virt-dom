module.exports = removeDOMNodes;


var removeDOMNode = require("./remove_dom_node");


function removeDOMNodes(nodes) {
    var i = -1,
        il = nodes.length - 1;

    while (i++ < il) {
        removeDOMNode(nodes[i]);
    }
}
