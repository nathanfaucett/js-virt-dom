var assert = require("assert"),
    isArrayLike = require("../src/index");


describe("isArrayLike", function() {
    it("should return true when the value is like an Array", function() {
        assert.equal(isArrayLike(null), false);
        assert.equal(isArrayLike(undefined), false);
        assert.equal(isArrayLike(0), false);
        assert.equal(isArrayLike(""), false);
        assert.equal(isArrayLike(function noop() {}), false);
        assert.equal(isArrayLike(/./), false);
        assert.equal(isArrayLike({}), false);
        assert.equal(isArrayLike(new ArrayBuffer()), false);

        assert.equal(isArrayLike([]), true);
        assert.equal(isArrayLike(arguments), true);
        assert.equal(isArrayLike(new Float32Array()), true);
        assert.equal(isArrayLike(new Float64Array()), true);
        assert.equal(isArrayLike(new Int8Array()), true);
        assert.equal(isArrayLike(new Int16Array()), true);
        assert.equal(isArrayLike(new Int32Array()), true);
        assert.equal(isArrayLike(new Uint8Array()), true);
        assert.equal(isArrayLike(new Uint8ClampedArray()), true);
        assert.equal(isArrayLike(new Uint16Array()), true);
        assert.equal(isArrayLike(new Uint32Array()), true);
    });
});
