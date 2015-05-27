var virt = global.virt = require("virt"),
    virtDOM = global.virtDOM = require("../src/index");


var virt_app = global.virt_app = document.getElementById("virt-app");


module.exports = {

    defer: true,

    setup: function() {
        var dir = 1,
            count = -1;

        function renderSpan(content) {
            return virt.createView("span", content);
        }

        function renderCount(count) {
            var list = [],
                i = count;

            while (i--) {
                list[list.length] = renderSpan(i);
            }

            list.unshift(renderSpan(count));

            return (
                virt.createView("p", {
                    className: "count " + count
                }, list)
            );
        }

        function renderCounter(count) {
            return (
                virt.createView("div", {
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
    },

    fn: function(deferred) {
        process.nextTick(function() {
            virtDOM.render(renderCounter(getCount()), virt_app);
            deferred.resolve();
        });
    }

};
