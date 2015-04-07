var assert = require("assert"),
    inherits = require("../src/index");


describe("inherits(childConstructor, parentConstructor)", function() {
    it("should make childConstructor inherits parentConstructor", function() {
        var male;

        function Person(name, sex) {
            this.name = name;
            this.sex = sex;
        }

        Person.staticFunction = function() {
            return "Person";
        };

        Person.prototype.print = function() {
            return this.name + " " + this.sex;
        };

        function Male(name) {
            Person.call(this, name, "male");
        }
        inherits(Male, Person);

        male = new Male("Bob");

        assert.deepEqual(male, {
            name: "Bob",
            sex: "male"
        });

        assert.equal(male.print(), "Bob male");
        assert.equal(Male.staticFunction(), "Person");
    });
});
