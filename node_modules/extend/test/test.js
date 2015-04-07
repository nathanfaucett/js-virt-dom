var assert = require("assert"),
    extend = require("../src/index");


describe("extend(out, ...objects)", function() {
    it("should extend out with objects members", function() {

        assert.deepEqual(extend({}, {
            name: "Bob"
        }, {
            age: 42
        }), {
            name: "Bob",
            age: 42
        });
    });
});
