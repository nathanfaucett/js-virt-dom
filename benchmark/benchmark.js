var Benchmark = require("benchmark"),
    virt = require("./virt"),
    react = require("./react"),
    virtualDOM = require("./virtual-dom");


var suite = new Benchmark.Suite(),
    statusDiv = document.getElementById("status");


global.process = process;


suite.add("virt", virt);
suite.add("React", react);
suite.add("virtual-dom", virtualDOM);

suite.on("complete", function onComplete() {
    var out = "";

    this.forEach(function(bench) {
        out += "<p>" + bench.toString() + "</p>";
    });

    out += "<p>Fastest is " + this.filter("fastest").pluck("name") + "</p>";

    statusDiv.innerHTML = out;
});

setTimeout(function() {
    suite.run();
});
