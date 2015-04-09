var getChildKey = require("virt/utils/get_child_key");


module.exports = renderChildrenString;


var renderString = require("./render_string");


function renderChildrenString(children, parentProps, id) {
    var out = "",
        i = -1,
        il = children.length - 1,
        child;

    while (i++ < il) {
        child = children[i];
        out += renderString(child, parentProps, getChildKey(id, child, i));
    }

    return out;
}
