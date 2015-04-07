var assert = require("assert"),
    getPrototypeOf = require("../src/index");


describe("getPrototypeOf(object)", function() {
    it("should return the prototype of the passed object", function() {
        var proto, object;

        proto = {
            key: "value"
        };
        object = Object.create(proto);

        assert.equal(getPrototypeOf(object), proto);
    });
});
