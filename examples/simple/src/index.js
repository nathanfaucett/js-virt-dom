var environment = require("environment"),
    eventListener = require("event_listener"),
    virt = require("virt"),
    virtDOM = require("../../../src/index");


var app;


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

var dir = 1,
    count = -1;

function render() {
    if (dir === 1 && count >= 5) {
        dir = -1;
    } else if (dir === -1 && count <= 0) {
        dir = 1;
    }

    count += dir;

    virtDOM.render(renderCounter(count), app);
    window.requestAnimationFrame(render, app);
}

eventListener.on(environment.window, "load", function() {
    app = document.getElementById("app");
    render();
});
