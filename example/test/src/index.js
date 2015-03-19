var environment = require("environment"),
    eventListener = require("event_listener"),
    virt = require("../../../virt"),
    virtDOMRender = require("../../../src/index");


var app = document.getElementById("app");


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

eventListener.on(environment.window, "load", function() {
    virtDOMRender(renderCounter(0), app);
    virtDOMRender(renderCounter(1), app);
});
