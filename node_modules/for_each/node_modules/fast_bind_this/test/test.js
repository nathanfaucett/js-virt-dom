var assert = require("assert"),
    fastBindThis = require("../src/index");


describe("fastBindThis", function() {
    it("should create new function with thisArg bound to this", function() {
        var _this, testBound;

        _this = {
            test: "test"
        };

        function test(a, b, c, d) {
            return this.test + a + b + c + d;
        }

        testBound = fastBindThis(test, _this, 4);

        assert.equal(testBound(0, 1, 2, 3), "test0123");
    });
});
