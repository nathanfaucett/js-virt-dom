var task = require("@nathanfaucett/task"),
    comn = require("@nathanfaucett/comn"),
    filePath = require("@nathanfaucett/file_path"),
    fs = require("fs"),
    pump = require("pump"),
    rename = require("gulp-rename"),
    envify = require("gulp-envify"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    jsbeautifier = require("gulp-jsbeautifier");


task("jsbeautifier", "beautifier js files", task.parallel(
    function() {
        return task.src("./taskfile.js").pipe(jsbeautifier()).pipe(task.dest("."));
    },
    function() {
        return task.src("./src/**/*.js").pipe(jsbeautifier()).pipe(task.dest("./src"));
    },
    function() {
        return task.src("./test/**/*.js").pipe(jsbeautifier()).pipe(task.dest("./test"));
    }
));

task("jshint", "run jshint", function() {
    return (
        task.src([
            "./taskfile.js",
            "./src/**/*.js",
            "./test/**/*.js"
        ])
        .pipe(jshint({
            es3: true,
            unused: true,
            curly: true,
            eqeqeq: true,
            expr: true,
            eqnull: true,
            proto: true
        }))
        .pipe(jshint.reporter("default"))
    );
});

task("comn", function(done) {
    var out = comn("./"),
        entry = out.entry();

    fs.writeFile(filePath.join(__dirname, "./dist/virt-dom.js"), entry.source, done);
});

task("envify", function() {
    return (
        task.src("dist/virt-dom.js")
        .pipe(envify({
            NODE_ENV: "production"
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(task.dest("./dist"))
    );
});

task("uglify", function(done) {
    return pump([
        task.src("./dist/virt-dom.min.js"),
        uglify(),
        task.dest("./dist")
    ], done);
});

task("default", task.series(
    task("jsbeautifier"),
    task("jshint")
));

task("dist", task.series(
    task("comn"),
    task("envify"),
    task("uglify")
));