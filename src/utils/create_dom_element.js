var DOM_ID_NAME = require("../dom_id_name"),
    nodeCache = require("./node_cache"),

    virt = require("virt"),
    getViewKey = require("virt/utils/get_view_key");


var View = virt.View,
    isView = View.isView,
    isPrimativeView = View.isPrimativeView;


module.exports = createDOMElement;


function createDOMElement(view, id, ownerDocument, recurse) {
    var node, children, i, length, child;

    if (isPrimativeView(view)) {
        return ownerDocument.createTextNode(view);
    } else if (isView(view)) {
        node = ownerDocument.createElement(view.type);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        if (recurse !== false) {
            children = view.children;
            i = -1;
            length = children.length - 1;

            while (i++ < length) {
                child = children[i];
                node.appendChild(createDOMElement(child, id + "." + getViewKey(child, i), ownerDocument));
            }
        }

        return node;
    } else {
        throw new TypeError("Arguments is not a valid view");
    }
}
