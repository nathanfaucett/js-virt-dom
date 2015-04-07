var assert = require("assert"),
    keys = require("../src/index");


describe("keys", function() {
    it("should return array of object keys", function() {
        assert.deepEqual(keys(null), []);
        assert.deepEqual(keys(undefined), []);
        assert.deepEqual(keys(0), []);
        assert.deepEqual(keys(""), []);
        assert.deepEqual(keys({}), []);
        assert.deepEqual(keys([]), []);
        assert.deepEqual(keys(/./), []);

        assert.deepEqual(keys({
            a: 0,
            b: 1,
            c: 2
        }), ["a", "b", "c"]);
    });
});
