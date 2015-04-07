var assert = require("assert"),
    isNode = require("../src/index");


describe("isNode", function() {
    it("should return true when the value is a Node", function() {
        assert.equal(isNode({
            nodeName: "div",
            nodeType: 3
        }), true);
    });
});
