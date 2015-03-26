var getNodeById = require("./utils/get_node_by_id"),
    applyPatch = require("./apply_patch");


module.exports = applyPatches;


function applyPatches(ids, hash, rootDOMNode, ownerDocument, eventHandler) {
    var length = ids.length - 1,
        id, i;

    if (length !== -1) {
        i = -1;
        while (i++ < length) {
            id = ids[i];
            applyPatchIndices(getNodeById(id) || rootDOMNode, hash[id], id, ownerDocument, eventHandler);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, ownerDocument, eventHandler) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], DOMNode, id, ownerDocument, eventHandler);
    }
}
