var nodeCache = require("./nodeCache");


module.exports = getNodeById;


function getNodeById(id) {
    return nodeCache[id];
}
