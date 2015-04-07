var assert = require("assert"),
    trim = require("../src/index");


describe("trim(str)", function() {
    it("should trim ends of string", function() {
        assert.equal(trim(" \t\n hey \t\n "), "hey");
        assert.equal(trim(), undefined);
        assert.equal(trim(null), null);
    });
});

describe("trim.left(str)", function() {
    it("should trim left of string", function() {
        assert.equal(trim.left(" \t\n hey \t\n "), "hey \t\n ");
        assert.equal(trim.left(), undefined);
        assert.equal(trim.left(null), null);
    });
});

describe("trim.right(str)", function() {
    it("should trim right of string", function() {
        assert.equal(trim.right(" \t\n hey \t\n "), " \t\n hey");
        assert.equal(trim.right(), undefined);
        assert.equal(trim.right(null), null);
    });
});
