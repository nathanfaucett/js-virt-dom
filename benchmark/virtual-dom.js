var virtualDOM_h = global.virtualDOM_h = require("virtual-dom/h"),
    virtualDOM_createElement = global.virtualDOM_createElement = require("virtual-dom/create-element"),
    virtualDOM_diff = global.virtualDOM_diff = require("virtual-dom/diff"),
    virtualDOM_patch = global.virtualDOM_patch = require("virtual-dom/patch");


var virtualDOM_app = global.virtualDOM_app = document.getElementById("virtual-dom-app");


var virtualDOM_tree = global.virtualDOM_tree = null,
    virtualDOM_rootNode = global.virtualDOM_rootNode = null,
    virtualDOM_started = global.virtualDOM_started = false;


module.exports = {

    defer: true,

    setup: function() {
        var dir = 1,
            count = -1;

        function renderSpan(content) {
            return virtualDOM_h("span", String(content));
        }

        function renderCount(count) {
            var list = [],
                i = count;

            while (i--) {
                list[list.length] = renderSpan(i);
            }

            list.unshift(renderSpan(count));

            return (
                virtualDOM_h("p", {
                    className: "count " + count
                }, list)
            );
        }

        function renderCounter(count) {
            return (
                virtualDOM_h("div", {
                    className: "counter " + count
                }, renderCount(count))
            );
        }

        function getCount() {
            if (dir === 1 && count >= 5) {
                dir = -1;
            } else if (dir === -1 && count <= 0) {
                dir = 1;
            }
            count += dir;
            return count;
        }

        virtualDOM_tree = renderCounter(getCount());
        virtualDOM_rootNode = virtualDOM_createElement(virtualDOM_tree);

        if (!virtualDOM_started) {
            virtualDOM_started = true;
        } else {
            virtualDOM_app.removeChild(virtualDOM_app.firstChild);
        }

        virtualDOM_app.appendChild(virtualDOM_rootNode);
    },

    fn: function(deferred) {
        var newTree = renderCounter(getCount()),
            patches = virtualDOM_diff(virtualDOM_tree, newTree);

        process.nextTick(function() {
            virtualDOM_rootNode = virtualDOM_patch(virtualDOM_rootNode, patches);
            virtualDOM_tree = newTree;
            deferred.resolve();
        });
    }
};
