var consts = require("../../virt/src/patches/consts"),
    createDOMElement = require("./utils/create_dom_element"),
    applyProperties = require("./apply_properties");



module.exports = applyPatch;


function applyPatch(patch, node, id) {
    switch (patch.type) {
        case consts.REMOVE:
            remove(node, patch.previous);
            break;
        case consts.INSERT:
            insert(node, patch.next, patch.id);
            break;
        case consts.TEXT:
            text(node, patch.text, patch.parentId, patch.index);
            break;
        case consts.REPLACE:
            replace(node, patch.next, patch.parentId, patch.index);
            break;
        case consts.ORDER:
            order(node, patch.order);
            break;
        case consts.PROPS:
            applyProperties(node, patch.next, patch.previous);
            break;
    }
}

function remove(node, previous) {
    var parentNode = node.parentNode;

    if (parentNode) {
        parentNode.removeChild(node);
    }
}

function insert(parentNode, view, id) {
    var newNode = createDOMElement(view, id);
    parentNode.appendChild(newNode);
}

function text(parentNode, patch, id, index) {
    var textNode = parentNode.childNodes[index],
        newNode;

    if (textNode.nodeType === 3) {
        textNode.nodeValue = patch;
    } else {
        newNode = createDOMElement(patch, id);
        parentNode.replaceChild(newNode, textNode);
    }
}

function replace(parentNode, view, id, index) {
    var newNode = createDOMElement(view, id);
    parentNode.replaceChild(newNode, parentNode.childNodes[index]);
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
