var Benchmark = require("benchmark"),
    virtRun = require("./virt"),
    reactRun = require("./react"),
    virtualDOMRun = require("./virtual-dom");


var suite = new Benchmark.Suite(),
    statusDiv = document.getElementById("status");


suite.add("React", reactRun);
suite.add("virt", virtRun);
suite.add("virtual-dom", virtualDOMRun);

suite.on("complete", function onComplete() {
    var out = "";

    this.forEach(function(bench) {
        out += "<p>" + bench.name +": "+ bench.hz + " ops/sec</p>";
    });

    out += "<p>Fastest is " + this.filter("fastest").pluck("name") + "</p>";

    statusDiv.innerHTML = out;
});

setTimeout(function() {
    suite.run({
        async: true
    });
});
