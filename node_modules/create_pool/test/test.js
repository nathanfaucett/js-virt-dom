var assert = require("assert"),
    createPool = require("../src/index");


describe("createPool(Constructor)", function() {
    it("should create object with create destroy methods", function() {
        var instance;

        function Constructor0() {}
        createPool(Constructor0);
        instance = Constructor0.getPooled();
        assert.equal(instance instanceof Constructor0, true);
        Constructor0.release(instance);

        function Constructor1(a0) {}
        createPool(Constructor1);
        instance = Constructor1.getPooled();
        assert.equal(instance instanceof Constructor1, true);
        Constructor1.release(instance);

        function Constructor2(a0, a1) {}
        createPool(Constructor2);
        instance = Constructor2.getPooled();
        assert.equal(instance instanceof Constructor2, true);
        Constructor2.release(instance);

        function Constructor3(a0, a1, a2) {}
        createPool(Constructor3);
        instance = Constructor3.getPooled();
        assert.equal(instance instanceof Constructor3, true);
        Constructor3.release(instance);

        function Constructor4(a0, a1, a2, a3, a4) {}
        createPool(Constructor4);
        instance = Constructor4.getPooled();
        assert.equal(instance instanceof Constructor4, true);
        Constructor4.release(instance);

        function Constructor5(a0, a1, a2, a3, a4, a5) {}
        createPool(Constructor5);
        instance = Constructor5.getPooled();
        assert.equal(instance instanceof Constructor5, true);
        Constructor5.release(instance);

        function Constructor6(a0, a1, a2, a3, a4, a5, a6) {}
        createPool(Constructor6);
        instance = Constructor6.getPooled();
        assert.equal(instance instanceof Constructor6, true);
        Constructor6.release(instance);
    });
});
