var applyPatch = require("./applyPatch");


module.exports = applyPatches;


function applyPatches(hash, rootDOMNode, document) {
    var patchArray, i, il;

    for (var id in hash) {
        if ((patchArray = hash[id])) {
            i = -1,
                il = patchArray.length - 1;

            while (i++ < il) {
                applyPatch(patchArray[i], id, rootDOMNode, document);
            }
        }
    }
}