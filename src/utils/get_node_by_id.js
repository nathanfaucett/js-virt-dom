var nodeCache = require("./node_cache");


module.exports = getNodeById;


function getNodeById(id) {
    return nodeCache[id];
}
