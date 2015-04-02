var consts = require("virt/transaction/consts"),
    createDOMElement = require("./utils/create_dom_element"),
    renderString = require("./utils/render_string"),
    addDOMNodes = require("./utils/add_dom_nodes"),
    removeDOMNodes = require("./utils/remove_dom_nodes"),
    getNodeById = require("./utils/get_node_by_id"),
    applyProperties = require("./apply_properties");



module.exports = applyPatch;


function applyPatch(patch, node, id, document) {
    switch (patch.type) {
        case consts.REMOVE:
            remove(node, patch.childId, patch.index);
            break;
        case consts.MOUNT:
            mount(node, patch.next, id);
            break;
        case consts.INSERT:
            insert(node, patch.childId, patch.index, patch.next, document);
            break;
        case consts.TEXT:
            text(node, patch.index, patch.next);
            break;
        case consts.REPLACE:
            replace(node, patch.childId, patch.index, patch.next, document);
            break;
        case consts.ORDER:
            order(node, patch.order);
            break;
        case consts.PROPS:
            applyProperties(node, patch.id, patch.next, patch.previous);
            break;
    }
}

function remove(parentNode, id, index) {
    var node;

    if (id === null) {
        node = parentNode.childNodes[index];
    } else {
        node = getNodeById(id);
        removeDOMNodes(node.childNodes);
    }

    if (parentNode !== node) {
        parentNode.removeChild(node);
    } else {
        node.parentNode.removeChild(node);
    }
}

function mount(parentNode, view, id) {
    parentNode.innerHTML = renderString(view, id);
    addDOMNodes(parentNode.childNodes);
}

function insert(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document, false);

    if (view.children) {
        node.innerHTML = renderString(view.children, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.appendChild(node);
}

function text(parentNode, index, value) {
    var textNode = parentNode.childNodes[index];

    if (textNode) {
        textNode.nodeValue = value;
    }
}

function replace(parentNode, id, index, view, document) {
    var node = createDOMElement(view, id, document, false);

    if (view.children) {
        node.innerHTML = renderString(view.children, id);
        addDOMNodes(node.childNodes);
    }

    parentNode.replaceChild(node, parentNode.childNodes[index]);
}

var order_children = [];

function order(parentNode, orderIndex) {
    var children = order_children,
        childNodes = parentNode.childNodes,
        reverseIndex = orderIndex.reverse,
        removes = orderIndex.removes,
        insertOffset = 0,
        i = -1,
        length = childNodes.length - 1,
        move, node, insertNode;

    children.length = length;
    while (i++ < length) {
        children[i] = childNodes[i];
    }

    i = -1;
    while (i++ < length) {
        move = orderIndex[i];

        if (move !== undefined && move !== i) {
            if (reverseIndex[i] > i) {
                insertOffset++;
            }

            node = children[move];
            insertNode = childNodes[i + insertOffset] || null;

            if (node !== insertNode) {
                parentNode.insertBefore(node, insertNode);
            }

            if (move < i) {
                insertOffset--;
            }
        }

        if (removes[i] != null) {
            insertOffset++;
        }
    }
}
