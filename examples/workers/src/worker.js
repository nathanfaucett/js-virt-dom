var virt = require("@nathanfaucett/virt"),
    virtDOM = require("../../../src/worker/server"),
    requestAnimationFrame = require("@nathanfaucett/request_animation_frame");


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

function onClick(e) {
    e.persist();
    console.log(e);
}

function renderCounter(count) {
    return (
        virt.createView("div", {
            onClick: onClick,
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

    virtDOM.render(renderCounter(count));
    requestAnimationFrame(render);
}

render();
