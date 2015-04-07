var assert = require("assert"),
    isDocument = require("../src/index");


describe("isDocument", function() {
    it("should return true when the value is a document node", function() {
        assert.equal(isDocument({
            nodeType: 9,
            nodeName: "#document"
        }), true);
    });
});
