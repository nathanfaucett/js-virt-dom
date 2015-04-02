var isPrimativeView = require("virt/view").isPrimativeView;


module.exports = getChildMapping;


function getChildMapping(children) {
    var childMapping = {},
        i = -1,
        il = children.length - 1,
        child;

    while (i++ < il) {
        child = children[i];

        if (!isPrimativeView(child)) {
            childMapping[child.key] = child;
        }
    }

    return childMapping;
}
