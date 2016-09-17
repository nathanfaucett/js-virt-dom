var virt = require("@nathanfaucett/virt");


var getChildKey = virt.getChildKey;


module.exports = renderChildrenString;


var renderString = require("./renderString");


function renderChildrenString(children, parentProps, id) {
    var localRenderString = renderString,
        localGetChildKey = getChildKey,
        out = "",
        i = -1,
        il = children.length - 1,
        child;

    while (i++ < il) {
        child = children[i];
        out += localRenderString(child, parentProps, localGetChildKey(id, child, i));
    }

    return out;
}