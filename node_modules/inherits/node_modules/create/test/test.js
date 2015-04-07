var assert = require("assert"),
    create = require("../src/index");


describe("create(object)", function() {
    it("should create object whose prototype is the passed object", function() {
        var object = {
            test: "test"
        };

        var child = create(object);
        assert.equal(Object.getPrototypeOf(child), object);
    });
});
