var Benchmark = require("benchmark"),
    virtRun = require("./virt"),
    reactRun = require("./react"),
    virtualDOMRun = require("./virtual-dom");


var suite = new Benchmark.Suite();


suite.add("React", reactRun);
suite.add("virt", virtRun);
suite.add("virtual-dom", virtualDOMRun);

suite.on("complete", function onComplete() {
    this.forEach(function(bench) {
        console.log(bench.name +": "+ bench.hz + " ops/sec");
    });

    console.log("Fastest is " + this.filter("fastest").pluck("name"));
});

suite.run({
    async: true
});
