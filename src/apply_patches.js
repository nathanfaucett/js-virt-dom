var getNodeById = require("./utils/get_node_by_id"),
    applyPatch = require("./apply_patch");


module.exports = applyPatches;


function applyPatches(patches, ownerDocument) {
    var hash = patches.hash,
        ids = patches.ids,
        length = ids.length - 1,
        id, i;

    if (length !== -1) {
        i = -1;
        while (i++ < length) {
            id = ids[i];
            applyPatchIndices(getNodeById(id), hash[id], id, ownerDocument);
        }
    }
}

function applyPatchIndices(DOMNode, patchArray, id, ownerDocument) {
    var i, length;

    if (DOMNode) {
        i = -1;
        length = patchArray.length - 1;

        while (i++ < length) {
            applyPatch(patchArray[i], DOMNode, id, ownerDocument);
        }
    }
}
