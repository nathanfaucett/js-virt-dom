var assert = require("assert"),
    escapeTextContent = require("../src/index");


describe("escapeTextContent(string)", function() {
    it("should escape text content", function() {
        assert.equal(escapeTextContent("<div></div>"), "&lt;div&gt;&lt;/div&gt;");
    });
});
