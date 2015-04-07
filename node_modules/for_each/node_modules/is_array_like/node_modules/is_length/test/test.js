var assert = require("assert"),
    isLength = require("../src/index");


describe("isLength", function() {
    it("should return true when the value is like an array's length", function() {
        assert.equal(isLength(null), false);
        assert.equal(isLength(undefined), false);
        assert.equal(isLength(""), false);
        assert.equal(isLength(1.23456789), false);
        assert.equal(isLength("1.23456789"), false);
        assert.equal(isLength({}), false);
        assert.equal(isLength([]), false);
        assert.equal(isLength(/./), false);
        assert.equal(isLength(function noop() {}), false);

        assert.equal(isLength(0), true);
        assert.equal(isLength(1000), true);
    });
});
