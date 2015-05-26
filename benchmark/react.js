var React = require("react");


var app = document.getElementById("react-app");


function renderSpan(content) {
    return React.createElement("span", {
        key: content
    }, content);
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

function run() {
    React.render(renderCounter(getCount()), app);
}

module.exports = run;
