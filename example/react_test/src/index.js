var environment = require("environment"),
    eventListener = require("event_listener"),
    React = require("react");


var app = document.getElementById("app");


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

var dir = 1,
    count = -1;

function render() {
    if (dir === 1 && count >= 5) {
        dir = -1;
    } else if (dir === -1 && count <= 0) {
        dir = 1;
    }

    count += dir;

    React.render(renderCounter(count), app);
    window.requestAnimationFrame(render, app);
}

eventListener.on(environment.window, "load", function() {
    render();
});
