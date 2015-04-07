var assert = require("assert"),
    keyMirror = require("../src/index");


describe("keyMirror(object)", function() {
    it("should, if array should return object where values are keys and values, if object should mirror keys", function() {

        assert.deepEqual(keyMirror(["KEY", "VALUE"]), {
            KEY: "KEY",
            VALUE: "VALUE"
        });

        assert.deepEqual(keyMirror({
            KEY: null,
            VALUE: null
        }), {
            KEY: "KEY",
            VALUE: "VALUE"
        });
    });
});
