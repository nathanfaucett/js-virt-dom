var DOM_ID_NAME = require("../dom_id_name"),
    nodeCache = require("./node_cache"),

    applyProperties = require("../apply_properties"),

    virt = require("virt"),
    getViewKey = require("virt/utils/get_view_key");


var View = virt.View,
    isView = View.isView,
    isPrimativeView = View.isPrimativeView;


module.exports = createDOMElement;


function createDOMElement(view, id, document, recurse) {
    var node, children, i, length, child;

    if (isPrimativeView(view)) {
        return document.createTextNode(view);
    } else if (isView(view)) {
        node = document.createElement(view.type);

        applyProperties(node, id, view.props, undefined);

        node.setAttribute(DOM_ID_NAME, id);
        nodeCache[id] = node;

        if (recurse !== false) {
            children = view.children;
            i = -1;
            length = children.length - 1;

            while (i++ < length) {
                child = children[i];
                node.appendChild(createDOMElement(child, id + "." + getViewKey(child, i), document));
            }
        }

        return node;
    } else {
        throw new TypeError("Arguments is not a valid view");
    }
}
