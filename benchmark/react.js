var React = global.React = require("react");


var react_app = global.react_app = document.getElementById("react-app");


module.exports = {

    defer: true,

    setup: function() {
        var dir = 1,
            count = -1;

        function renderSpan(content) {
            return React.createElement("span", null, content);
        }

        function renderCount(count) {
            var list = [],
                i = count;

            while (i--) {
                list[list.length] = renderSpan(i);
            }

            list.unshift(renderSpan(count));

            return (
                React.createElement("p", {
                    className: "count " + count
                }, list)
            );
        }

        function renderCounter(count) {
            return (
                React.createElement("div", {
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
            React.render(renderCounter(getCount()), react_app);
            deferred.resolve();
        });
    }
};
