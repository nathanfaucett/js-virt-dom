var has = require("@nathanfaucett/has"),
    applyPatch = require("./applyPatch");


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, document) {
    var localHas = has,
        id;

    for (id in hash) {
        if (localHas(hash, id)) {
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