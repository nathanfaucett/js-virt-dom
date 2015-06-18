var test = require("tape"),
    virtDOM = require("../src/index");


var virt = virtDOM.virt,
    app = document.createElement("app");


test("mount", function(assert) {
    virtDOM.render(virt.createView("p", "Hello World!"), app);
    assert.equal(app.childNodes.length, 1);
    assert.equal(app.childNodes[0].innerHTML, "Hello World!");
    assert.end();
});
