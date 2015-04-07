var assert = require("assert"),
    mixin = require("../src/index");


describe("mixin(out, ...objects)", function() {
    it("should mixin out with objects members", function() {

        assert.deepEqual(mixin({
            name: "Bob",
            age: null
        }, {
            name: null
        }, {
            age: 42
        }), {
            name: "Bob",
            age: 42
        });
    });
});
