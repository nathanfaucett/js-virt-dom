var h = require("virtual-dom/h"),
    diff = require("virtual-dom/diff"),
    patch = require("virtual-dom/patch"),
    createElement = require("virtual-dom/create-element");


var app = document.getElementById("virtual-dom-app");


function renderSpan(content) {
    return h("span", String(content));
}

function renderCount(count) {
    var list = [],
        i = count;

    while (i--) {
        list[list.length] = renderSpan(i);
    }

    list.unshift(renderSpan(count));

    return (
        h("p", {
            className: "count " + count
        }, list)
    );
}

function renderCounter(count) {
    return (
        h("div", {
            className: "counter " + count
        }, renderCount(count))
    );
}

var dir = 1,
    count = -1;

function getCount() {
    if (dir === 1 && count >= 5) {
        dir = -1;
    } else if (dir === -1 && count <= 0) {
        dir = 1;
    }
    count += dir;
    return count;
}

var tree = renderCounter(getCount()),
    rootNode = createElement(tree);

app.appendChild(rootNode);

function run() {
    var newTree = renderCounter(getCount()),
        patches = diff(tree, newTree);

    rootNode = patch(rootNode, patches);
    tree = newTree;
}

module.exports = run;
