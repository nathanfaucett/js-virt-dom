var getNodeById = require("./utils/get_node_by_id"),
    applyPatch = require("./apply_patch");


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, ownerDocument) {
    var id;

    for (id in hash) {
        if (hash[id] !== undefined) {
            applyPatchIndices(getNodeById(id) || rootDOMNode, hash[id], id, ownerDocument);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, ownerDocument) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], DOMNode, id, ownerDocument);
    }
}
