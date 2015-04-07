var assert = require("assert"),
    has = require("../src/index");


describe("has", function() {
    it("should return true if object has own property", function() {
        var object = {
            key: "key"
        };

        assert.deepEqual(has(object, "key"), true);
        assert.deepEqual(has(object, "value"), false);
    });
});
