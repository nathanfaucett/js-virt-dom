var assert = require("assert"),
    isNullOrUndefined = require("../src/index");


describe("isNullOrUndefined", function() {
    it("should return true when the value is a null or undefined", function() {
        assert.equal(isNullOrUndefined({}), false);
        assert.equal(isNullOrUndefined([]), false);
        assert.equal(isNullOrUndefined(""), false);
        assert.equal(isNullOrUndefined(/./), false);
        assert.equal(isNullOrUndefined(0), false);
        assert.equal(isNullOrUndefined(function noop() {}), false);

        assert.equal(isNullOrUndefined(void 0), true);
        assert.equal(isNullOrUndefined(null), true);
    });
});
