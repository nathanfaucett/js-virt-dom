var applyPatch = require("./apply_patch");


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, document) {
    var id;

    for (id in hash) {
        if (hash[id] !== undefined) {
            applyPatchIndices(hash[id], id, document, rootDOMNode);
        }
    }
}

function applyPatchIndices(patchArray, id, document, rootDOMNode) {
    var i = -1,
        length = patchArray.length - 1;

    while (i++ < length) {
        applyPatch(patchArray[i], id, document, rootDOMNode);
    }
}
